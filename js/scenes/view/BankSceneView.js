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
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/scenes/view/piggyBankShapes' );
  const SceneView = require( 'NUMBER_LINE_INTEGERS/scenes/view/SceneView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const NUMBER_LINE_LABEL_FONT = new PhetFont( { size: 18, weight: 'bold' } );
  const BALANCE_CHANGE_AMOUNT = 1; // in dollars (or whatever currency units are being used)

  // images
  const piggyBankWithFlowers = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-flowers.png' );
  const piggyBankWithLightning = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-lightning.png' );

  // strings
  const balanceString = require( 'string!NUMBER_LINE_INTEGERS/balance' );
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  // constants
  const INSET = 10;

  class BankSceneView extends SceneView {

    constructor( sceneModel, layoutBounds ) {

      super( sceneModel, layoutBounds, {
        numberLineOptions: {
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
        switchSize: new Dimension2( 50, 15 ),
        setEnabled: () => {}
      }, options );

      class PiggyBankNode extends Node {

        // TODO: lots of duplication between here and BankPointControllerNode
        constructor( imageSource ) {
          const piggyBankOutlineNode = new Path( piggyBankShapes.MEDIUM_PIGGY_BANK_SHAPE, {
            fill: 'rgba( 0, 0, 0, 0 )', // transparent to start so it has size
            lineWidth: 0,
            center: Vector2.ZERO
          } );
          const overlayImage = new Image( imageSource, { opacity: 0.8 } );
          overlayImage.setScaleMagnitude( piggyBankOutlineNode.width / overlayImage.width );
          overlayImage.center = Vector2.ZERO;
          super( { children: [ piggyBankOutlineNode, overlayImage ] } );
          this.outline = piggyBankOutlineNode;
        }

        setHasFill( hasFill ) {
          this.outline.fill = `rgba( 255, 255, 255, ${ hasFill ? 255 : 0 } )`;
        }

      }

      const singleFlowersPiggyBankNode = new PiggyBankNode( piggyBankWithFlowers );
      const doubleFlowersPiggyBankNode = new PiggyBankNode( piggyBankWithFlowers );
      const doubleLightningPiggyBankNode = new PiggyBankNode( piggyBankWithLightning );

      singleFlowersPiggyBankNode.maxWidth = 40;
      doubleFlowersPiggyBankNode.maxWidth = 30;
      doubleLightningPiggyBankNode.maxWidth = 40;

      property.link( isDoublePiggyBank => {
        singleFlowersPiggyBankNode.setHasFill( !isDoublePiggyBank );
        doubleFlowersPiggyBankNode.setHasFill( isDoublePiggyBank );
        doubleLightningPiggyBankNode.setHasFill( isDoublePiggyBank );
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