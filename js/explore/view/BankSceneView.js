// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Bank" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Saurabh Totey
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const AccountBalanceControllerNode = require( 'NUMBER_LINE_INTEGERS/explore/view/AccountBalanceControllerNode' );
  const BankPointControllerNode = require( 'NUMBER_LINE_INTEGERS/explore/view/BankPointControllerNode' );
  const BankSceneModel = require( 'NUMBER_LINE_INTEGERS/explore/model/BankSceneModel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/explore/view/PiggyBankNode' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/SceneView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const BALANCE_CHANGE_AMOUNT = 1; // in dollars (or whatever currency units are being used)

  // strings
  const balanceString = require( 'string!NUMBER_LINE_INTEGERS/balance' );
  const currencyUnitsString = require( 'string!NUMBER_LINE_INTEGERS/currencyUnits' );
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  // constants
  const INSET = 10;

  class BankSceneView extends SceneView {

    /**
     * @param {BankSceneModel} bankSceneModel
     * @param {Bounds2} layoutBounds
     * @public
     */
    constructor( bankSceneModel, layoutBounds ) {

      super( bankSceneModel, layoutBounds, {
        commonNumberLineNodeOptions: {
          numericalLabelTemplate: StringUtils.fillIn( moneyAmountString, { currencyUnit: currencyUnitsString } )
        }
      } );

      // get a reference to the only number line node in this scene
      const numberLineNode = this.numberLineNodes[ 0 ];

      // number line label
      const numberLineLabel = new Text( balanceString, {
        font: NUMBER_LINE_LABEL_FONT,
        right: numberLineNode.left - 4,
        centerY: bankSceneModel.numberLines[ 0 ].centerPosition.y,
        maxWidth: layoutBounds.width * 0.08
      } );
      this.scenesLayer.addChild( numberLineLabel );
      bankSceneModel.showNumberLineProperty.linkAttribute( numberLineLabel, 'visible' );

      // add the switch that controls whether one or two accounts are shown
      this.scenesLayer.addChild( new AccountVisibilityControlSwitch( bankSceneModel.showComparisonAccountProperty, {
        right: this.layoutBounds.maxX - INSET,
        centerY: numberLineNode.centerY
      } ) );

      const pointControllerNodesLayer = new Node();
      this.scenesLayer.addChild( pointControllerNodesLayer );
      pointControllerNodesLayer.moveToBack();

      // add node to represent the point controller that is always visible
      const permanentPointControllerNode = new BankPointControllerNode(
        bankSceneModel.primaryAccountPointController,
        bankSceneModel.primaryAccount.balanceChangedByButtonEmitter,
        'flowers',
        { connectorLineVisibleProperty: bankSceneModel.showNumberLineProperty }
      );
      pointControllerNodesLayer.addChild( permanentPointControllerNode );

      // add and remove a node for the comparison account point controller as it comes and goes
      let comparisonAccountPointControllerNode = null;
      bankSceneModel.comparisonAccountPointControllerProperty.lazyLink( pointController => {
        if ( pointController ) {
          comparisonAccountPointControllerNode = new BankPointControllerNode(
            pointController,
            bankSceneModel.comparisonAccount.balanceChangedByButtonEmitter,
            'lightning',
            { connectorLineVisibleProperty: bankSceneModel.showNumberLineProperty }
          );
          pointControllerNodesLayer.addChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.moveToBack(); // make sure this is behind the number line point that it controls
        }
        else {
          pointControllerNodesLayer.removeChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.dispose();
        }
      } );

      // calculate a horizontal position for the account balance controls that is centered between some other controls
      const accountBalanceControllersCenterX = ( this.comparisonStatementAccordionBoxes[ 0 ].right +
                                                 this.checkboxGroup.bounds.minX ) / 2;

      // add the controller for the primary account
      const primaryAccountBalanceControllerNode = new AccountBalanceControllerNode(
        bankSceneModel.primaryAccount.balanceProperty,
        bankSceneModel.primaryAccount.balanceChangedByButtonEmitter,
        bankSceneModel.numberLines[ 0 ].displayedRangeProperty.value,
        BALANCE_CHANGE_AMOUNT,
        {
          buttonBaseColor: BankSceneModel.PRIMARY_ACCOUNT_POINT_COLOR,
          centerX: accountBalanceControllersCenterX,
          top: numberLineNode.centerY + 70
        }
      );
      this.scenesLayer.addChild( primaryAccountBalanceControllerNode );

      // add the controller for the comparison account, and show it only when that account is enabled
      const comparisonAccountBalanceControllerNode = new AccountBalanceControllerNode(
        bankSceneModel.comparisonAccount.balanceProperty,
        bankSceneModel.comparisonAccount.balanceChangedByButtonEmitter,
        bankSceneModel.numberLines[ 0 ].displayedRangeProperty.value,
        BALANCE_CHANGE_AMOUNT,
        {
          buttonBaseColor: BankSceneModel.COMPARISON_ACCOUNT_POINT_COLOR,
          centerX: accountBalanceControllersCenterX,
          bottom: numberLineNode.centerY - 70
        }
      );
      bankSceneModel.showComparisonAccountProperty.linkAttribute( comparisonAccountBalanceControllerNode, 'visible' );
      this.scenesLayer.addChild( comparisonAccountBalanceControllerNode );

      // Monitor the account controllers for when their buttons are released by the user and make sure that the values
      // of the two accounts are not the same and, if they are, correct the situation.
      primaryAccountBalanceControllerNode.buttonReleasedEmitter.addListener( () => {
        if ( bankSceneModel.showComparisonAccountProperty.value &&
             bankSceneModel.comparisonAccount.balanceProperty.value === bankSceneModel.primaryAccount.balanceProperty.value ) {

          // set the comparison account to the previous value of the primary account, in effect swapping values
          bankSceneModel.comparisonAccount.balanceProperty.value = bankSceneModel.primaryAccount.previousBalance;
        }
      } );
      comparisonAccountBalanceControllerNode.buttonReleasedEmitter.addListener( () => {
        if ( bankSceneModel.comparisonAccount.balanceProperty.value === bankSceneModel.primaryAccount.balanceProperty.value ) {

          // set the primary account to the previous value of the comparison account, in effect swapping values
          bankSceneModel.primaryAccount.balanceProperty.value = bankSceneModel.comparisonAccount.previousBalance;
        }
      } );
    }
  }

  /**
   * switch for controlling whether one or two account balances are shown
   * @private
   */
  class AccountVisibilityControlSwitch extends ABSwitch {

    constructor( property, options ) {

      options = merge( {
        switchSize: new Dimension2( 50, 15 ),
        setEnabled: () => {}
      }, options );

      // TODO: these are not named well: single means on the left side to allow user to control single piggy bank
      //  double means that user can control 2 piggy banks
      const singleFlowersPiggyBankNode = new PiggyBankNode( { decorationType: 'flowers' } );
      const doubleFlowersPiggyBankNode = new PiggyBankNode( { decorationType: 'flowers' } );
      const doubleLightningPiggyBankNode = new PiggyBankNode( { decorationType: 'lightning' } );

      singleFlowersPiggyBankNode.maxWidth = 40;
      doubleFlowersPiggyBankNode.maxWidth = 30;
      doubleLightningPiggyBankNode.maxWidth = 40;

      const inactiveColor = 'rgb( 210, 210, 210 )';
      const activeColor = 'rgb( 0, 180, 147 )';

      property.link( isDoublePiggyBank => {
        const singleFill = isDoublePiggyBank ? inactiveColor : activeColor;
        const doubleFill = isDoublePiggyBank ? activeColor : inactiveColor;
        singleFlowersPiggyBankNode.fill = singleFill;
        doubleFlowersPiggyBankNode.fill = doubleFill;
        doubleLightningPiggyBankNode.fill = doubleFill;
      } );

      super(
        property,
        false,
        singleFlowersPiggyBankNode,
        true,
        new HBox( {
          children: [ doubleFlowersPiggyBankNode, doubleLightningPiggyBankNode ],
          spacing: 10
        } ),
        options
      );
    }
  }

  return numberLineIntegers.register( 'BankSceneView', BankSceneView );
} );
