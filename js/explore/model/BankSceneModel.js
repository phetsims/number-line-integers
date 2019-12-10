// Copyright 2019, University of Colorado Boulder

/**
 * model for the "bank" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BankAccount = require( 'NUMBER_LINE_INTEGERS/explore/model/BankAccount' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Color = require( 'SCENERY/util/Color' );
  const LockToNumberLine = require( 'NUMBER_LINE_INTEGERS/common/model/LockToNumberLine' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NumberLinePoint = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLinePoint' );
  const Orientation = require( 'PHET_CORE/Orientation' );
  const PointController = require( 'NUMBER_LINE_INTEGERS/common/model/PointController' );
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

    /**
     * @public
     */
    constructor() {

      // Position the number line on the left portion of the screen and roughly centered vertically.  The details of
      // these values were empirically determined by comparing with the mockups in the design doc.
      const numberLineZeroPosition = new Vector2( SCENE_BOUNDS.width * 0.37, SCENE_BOUNDS.centerY );

      super( {
        numberLineZeroPositions: [ numberLineZeroPosition ],
        commonNumberLineOptions: {
          initialOrientation: Orientation.HORIZONTAL,
          initialDisplayedRange: new Range( -100, 100 ), // REVIEW: duplicate value of base class
          labelsInitiallyVisible: true,
          widthInModelSpace: SCENE_BOUNDS.width * 0.475,
          initialPointSpecs: [ {
            initialValue: INITIAL_PRIMARY_ACCOUNT_BALANCE,
            color: new Color( PRIMARY_ACCOUNT_POINT_COLOR )
          } ]
        }
      } );

      // @public - bank account that is always shown in the view
      this.primaryAccount = new BankAccount( INITIAL_PRIMARY_ACCOUNT_BALANCE );

      // there is only one number line in this scene - get a local reference to it for convenience
      assert && assert( this.numberLines.length === 1 );
      const numberLine = this.numberLines[ 0 ];

      // hook the primary account balance up to the first number line point
      this.primaryAccount.balanceProperty.link( balance => {
        numberLine.residentPoints.get( 0 ).proposeValue( balance );
      } );
      numberLine.residentPoints.get( 0 ).valueProperty.link( value => {
        this.primaryAccount.balanceProperty.value = value;
      } );

      // @public {BankAccount} - bank account that is shown when the user wants to compare two accounts
      this.comparisonAccount = new BankAccount( INITIAL_COMPARISON_ACCOUNT_BALANCE );

      // hook the comparison account balance up to the second number line point
      this.comparisonAccount.balanceProperty.link( balance => {
        if ( numberLine.residentPoints.length > 1 ) {
          numberLine.residentPoints.get( 1 ).proposeValue( balance );
        }
      } );

      // @public {BooleanProperty} - controls whether the comparison account should be visible to the user
      this.showComparisonAccountProperty = new BooleanProperty( false );

      // @public {PointController} - the point controller for the primary account
      this.primaryAccountPointController = new PointController( {
        color: numberLine.residentPoints.get( 0 ).colorProperty.value,
        lockToNumberLine: LockToNumberLine.ALWAYS,
        numberLinePoints: [ numberLine.residentPoints.get( 0 ) ],
        offsetFromHorizontalNumberLine: 120,
        numberLines: [ numberLine ]
      } );

      // REVIEW: missing doc
      this.comparisonAccountPointController = new PointController( {
        lockToNumberLine: LockToNumberLine.ALWAYS,
        offsetFromHorizontalNumberLine: -120,
        numberLines: [ numberLine ]
      } );

      // the number line point that represents the comparison account value, only exists when enabled
      let comparisonAccountNumberLinePoint = null;

      // add/remove the point and point controller for the comparison account when enabled
      this.showComparisonAccountProperty.lazyLink( showComparisonAccount => {
        if ( showComparisonAccount ) {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint === null,
            'shouldn\'t have number line point for comparison account yet'
          );
          assert && assert(
            this.comparisonAccountPointController.numberLinePoints.length === 0,
            'shouldn\'t have number line point for comparison account controller yet'
          );

          // create the point and add it to the number line
          comparisonAccountNumberLinePoint = new NumberLinePoint(
            this.comparisonAccount.balanceProperty.value,
            COMPARISON_ACCOUNT_POINT_COLOR,
            numberLine
          );
          numberLine.addPoint( comparisonAccountNumberLinePoint );

          comparisonAccountNumberLinePoint.valueProperty.link( value => {
            this.comparisonAccount.balanceProperty.value = value;
          } );

          // associate the controller with this point
          this.comparisonAccountPointController.associateWithNumberLinePoint( comparisonAccountNumberLinePoint );
        }
        else {

          // state checking
          assert && assert(
            comparisonAccountNumberLinePoint !== null,
            'should have number line point for comparison account'
          );
          assert && assert(
            this.comparisonAccountPointController.numberLinePoints.length === 1,
            'should be controlling a point'
          );

          // remove the point for the comparison account from the number line
          this.comparisonAccountPointController.dissociateFromNumberLinePoint( comparisonAccountNumberLinePoint );
          numberLine.removePoint( comparisonAccountNumberLinePoint );
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
  }

  // static properties
  BankSceneModel.PRIMARY_ACCOUNT_POINT_COLOR = PRIMARY_ACCOUNT_POINT_COLOR;
  BankSceneModel.COMPARISON_ACCOUNT_POINT_COLOR = COMPARISON_ACCOUNT_POINT_COLOR;

  return numberLineIntegers.register( 'BankSceneModel', BankSceneModel );
} );
