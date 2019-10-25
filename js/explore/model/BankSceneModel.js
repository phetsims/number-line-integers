// Copyright 2019, University of Colorado Boulder

/**
 * model for the "bank" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const Emitter = require( 'AXON/Emitter' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const NumberIO = require( 'TANDEM/types/NumberIO' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const SceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/SceneModel' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const SCENE_BOUNDS = NLIConstants.NLI_LAYOUT_BOUNDS; // bounds for the scenes match the layout bounds
  const PRIMARY_ACCOUNT_POINT_COLOR = new Color( '#d25da3' );
  const COMPARISON_ACCOUNT_POINT_COLOR = new Color( '#001fff' );
  const INITIAL_PRIMARY_ACCOUNT_BALANCE = 10;
  const INITIAL_COMPARISON_ACCOUNT_BALANCE = 40;

  /**
   * model for the "Bank" scene
   */
  class BankSceneModel extends SceneModel {

    constructor() {

      // Position the number line on the left portion of the screen and roughly centered vertically.  The details of
      // these values were empirically determined by comparing with the mockups in the design doc.
      const numberLineZeroPosition = new Vector2( SCENE_BOUNDS.width * 0.37, SCENE_BOUNDS.centerY );

      super( {
        numberLineZeroPosition: numberLineZeroPosition,
        numberLineOptions: {
          initialOrientation: NumberLineOrientation.HORIZONTAL,
          initialDisplayedRange: new Range( -100, 100 ),
          labelsInitiallyVisible: true,
          widthInModelSpace: SCENE_BOUNDS.width * 0.475,
          initialPointSpecs: [ {
            initialValue: INITIAL_PRIMARY_ACCOUNT_BALANCE,
            color: new Color( PRIMARY_ACCOUNT_POINT_COLOR )
          } ]
        }
      } );

      // @public - bank account that is always shown in the view
      this.primaryAccount = new Account( INITIAL_PRIMARY_ACCOUNT_BALANCE );

      // hook the primary account balance up to the first number line point
      this.primaryAccount.balanceProperty.link( balance => {
        this.numberLine.residentPoints.get( 0 ).proposeValue( balance );
      } );
      this.numberLine.residentPoints.get( 0 ).valueProperty.link( value => {
        this.primaryAccount.balanceProperty.value = value;
      } );

      // @public {Account} - bank account that is shown when the user wants to compare two accounts
      this.comparisonAccount = new Account( INITIAL_COMPARISON_ACCOUNT_BALANCE );

      // hook the comparison account balance up to the second number line point
      this.comparisonAccount.balanceProperty.link( balance => {
        if ( this.numberLine.residentPoints.length > 1 ) {
          this.numberLine.residentPoints.get( 1 ).proposeValue( balance );
        }
      } );

      // @public {BooleanProperty} - controls whether the comparison account should be visible to the user
      this.showComparisonAccountProperty = new BooleanProperty( false );

      // @public {PointController} - the point controller for the primary account
      this.primaryAccountPointController = new PointController( {
        color: this.numberLine.residentPoints.get( 0 ).colorProperty.value,
        lockToNumberLine: 'always',
        associatedNumberLinePoints: [ this.numberLine.residentPoints.get( 0 ) ],
        offsetFromHorizontalNumberLine: 120,
        numberLines: [ this.numberLine ]
      } );

      // the number line point that represents the comparison account value, only exists when enabled
      let comparisonAccountNumberLinePoint = null;

      // @public {Property.<PointController|null>} - the point controller for the comparison account, only exists when
      // enabled, and is thus wrapped in a property so that the view can see it come and go
      this.comparisonAccountPointControllerProperty = new Property( null );

      // add/remove the point and point controller for the comparison account when enabled
      this.showComparisonAccountProperty.lazyLink( showComparisonAccount => {
        if ( showComparisonAccount ) {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint === null,
            'shouldn\'t have number line point for comparison account yet'
          );
          assert && assert(
            this.comparisonAccountPointControllerProperty.value === null,
            'shouldn\'t have number point controller for comparison account yet'
          );

          // create the point and add it to the number line
          comparisonAccountNumberLinePoint = new NumberLinePoint(
            this.comparisonAccount.balanceProperty.value,
            COMPARISON_ACCOUNT_POINT_COLOR,
            this.numberLine
          );
          this.numberLine.addPoint( comparisonAccountNumberLinePoint );

          comparisonAccountNumberLinePoint.valueProperty.link( value => {
            this.comparisonAccount.balanceProperty.value = value;
          } );

          // create the controller fo this point
          this.comparisonAccountPointControllerProperty.value = new PointController( {
            lockToNumberLine: 'always',
            associatedNumberLinePoints: [ comparisonAccountNumberLinePoint ],
            offsetFromHorizontalNumberLine: -120,
            numberLines: [ this.numberLine ]
          } );
        }
        else {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint !== null,
            'should have number line point for comparison account'
          );
          assert && assert(
            this.comparisonAccountPointControllerProperty.value !== null,
            'should have point controller for comparison account'
          );

          // remove the point controller from the model
          this.comparisonAccountPointControllerProperty.value.clearNumberLinePoints();
          this.comparisonAccountPointControllerProperty.value.dispose();
          this.comparisonAccountPointControllerProperty.reset();

          // remove the point from the number line
          this.numberLine.removePoint( comparisonAccountNumberLinePoint );
          comparisonAccountNumberLinePoint = null;
        }
      } );
    }

    /**
     * restore initial state to the scene
     * @override
     * @public
     */
    resetScene() {
      this.primaryAccount.reset();
      this.showComparisonAccountProperty.reset();
      this.comparisonAccount.reset();
    }

    // statics - colors used for primary and comparison account points
    static get PRIMARY_ACCOUNT_POINT_COLOR() { return PRIMARY_ACCOUNT_POINT_COLOR; } // eslint-disable-line bad-sim-text

    static get COMPARISON_ACCOUNT_POINT_COLOR() { return COMPARISON_ACCOUNT_POINT_COLOR; } // eslint-disable-line bad-sim-text
  }

  class Account {
    constructor( initialBalance = 0 ) {

      // @public
      this.balanceProperty = new NumberProperty( initialBalance );

      // @public - An emitter that should be triggered to signal that the balance was changed due to interaction with
      // the add/remove buttons rather than by dragging, reset, or other means.  The value should be +1 for an increase
      // and -1 for a decrease.
      this.balanceChangedByButtonEmitter = new Emitter( {
        parameters: [ { phetioType: NumberIO, name: 'balanceChange' } ]
      } );

      // @public (read-only) {Number|null} - previous balance, null if there is none
      this.previousBalance = null;

      this.balanceProperty.lazyLink( ( newBalance, oldBalance ) => {
        this.previousBalance = oldBalance;
      } );
    }

    /**
     * restore initial state
     * @public
     */
    reset() {
      this.balanceProperty.reset();
    }
  }

  return numberLineIntegers.register( 'BankSceneModel', BankSceneModel );
} );
