// Copyright 2019, University of Colorado Boulder

/**
 * view for the "Bank" scene
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ABSwitch = require( 'SUN/ABSwitch' );
  const AccountBalanceControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/AccountBalanceControllerNode' );
  const BankPointControllerNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/BankPointControllerNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/scenes/view/piggyBankShapes' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const BALANCE_CHANGE_AMOUNT = 1; // in dollars (or whatever currency units are being used)

  // strings
  const balanceString = require( 'string!NUMBER_LINE_INTEGERS/balance' );
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  // constants
  const INSET = 10;

  class BankSceneView extends SceneView {

    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineOptions: {

          //TODO: this doesn't quite work well with negative signs
          numberDisplayTemplate: moneyAmountString
        }
      } );

      // number line label
      this.addChild( new Text( balanceString, {
        font: NUMBER_LINE_LABEL_FONT,
        right: this.numberLineNode.left - 4,
        centerY: sceneModel.numberLine.centerPosition.y
      } ) );

      // add the switch that controls whether one or two accounts are shown
      this.addChild( new AccountVisibilityControlSwitch( sceneModel.showComparisonAccountProperty, {
        right: this.layoutBounds.maxX - INSET,
        centerY: this.numberLineNode.centerY
      } ) );

      const pointControllerNodesLayer = new Node();
      this.addChild( pointControllerNodesLayer );
      pointControllerNodesLayer.moveToBack();

      // add node to represent the point controller that is always visible
      const permanentPointControllerNode = new BankPointControllerNode(
        sceneModel.primaryAccountPointController,
        'flowers'
      );
      pointControllerNodesLayer.addChild( permanentPointControllerNode );

      // add and remove a node for the comparison account point controller as it comes and goes
      let comparisonAccountPointControllerNode = null;
      sceneModel.comparisonAccountPointControllerProperty.lazyLink( pointController => {
        if ( pointController ) {
          comparisonAccountPointControllerNode = new BankPointControllerNode( pointController, 'lightning' );
          pointControllerNodesLayer.addChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.moveToBack(); // make sure this is behind the number line point that it controls
        }
        else {
          pointControllerNodesLayer.removeChild( comparisonAccountPointControllerNode );
          comparisonAccountPointControllerNode.dispose();
        }
      } );

      // add the controller for the primary account
      this.addChild( new AccountBalanceControllerNode(
        sceneModel.primaryAccountBalanceProperty,
        sceneModel.numberLine.displayedRangeProperty.value,
        BALANCE_CHANGE_AMOUNT,
        {
          centerX: ( this.numberLineNode.bounds.maxX + this.checkboxGroup.bounds.minX ) / 2,
          top: this.numberLineNode.centerY + 70
        }
      ) );

      // add the controller for the comparison account, and show it only when that account is enabled
      const comparisonAccountBalanceControllerNode = new AccountBalanceControllerNode(
        sceneModel.comparisonAccountBalanceProperty,
        sceneModel.numberLine.displayedRangeProperty.value,
        BALANCE_CHANGE_AMOUNT,
        {
          centerX: ( this.numberLineNode.bounds.maxX + this.checkboxGroup.bounds.minX ) / 2,
          bottom: this.numberLineNode.centerY - 70
        }
      );
      sceneModel.showComparisonAccountProperty.linkAttribute( comparisonAccountBalanceControllerNode, 'visible' );
      this.addChild( comparisonAccountBalanceControllerNode );
    }
  }

  /**
   * switch for controlling whether one or two account balances are shown
   * @private
   */
  class AccountVisibilityControlSwitch extends ABSwitch {

    constructor( property, options ) {

      options = _.extend( {
        switchSize: new Dimension2( 50, 15 )
      }, options );

      const lineWidth = 2;

      super(
        property,
        false,
        new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
          maxWidth: 30,
          fill: 'white',
          stroke: 'blue',
          lineWidth: lineWidth
        } ),
        true,
        new HBox( {
          children: [
            new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
              maxWidth: 20,
              fill: 'white',
              stroke: 'blue',
              lineWidth: lineWidth
            } ),
            new Path( piggyBankShapes.SMALL_PIGGY_BANK_SHAPE, {
              maxWidth: 30,
              fill: 'white',
              stroke: 'orange',
              lineWidth: lineWidth
            } )
          ],
          spacing: 10
        } ),
        options
      );
    }
  }

  return numberLineIntegers.register( 'BankSceneView', BankSceneView );
} );