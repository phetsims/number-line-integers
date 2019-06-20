// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Bank" scene of the Number Line Integers sim
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const Image = require( 'SCENERY/nodes/Image' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const piggyBankShapes = require( 'NUMBER_LINE_INTEGERS/scenes/view/piggyBankShapes' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MIN_WIDTH = 80; // screen coords, empirically determined
  const MAX_WIDTH = 200; // screen coords, empirically determined
  const PIGGY_BANK_GREEN_FILL = new Color( 77, 177, 148 );
  const PIGGY_BANK_RED_FILL = new Color( 235, 66, 44 );
  const OUTLINE_LINE_WIDTH = 4;

  // images
  const piggyBankWithFlowers = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-flowers.png' );
  const piggyBankWithLightning = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-lightning.png' );

  // strings
  const moneyAmountString = require( 'string!NUMBER_LINE_INTEGERS/moneyAmount' );

  class BankPointControllerNode extends PointControllerNode {

    /**
     * @param {PointController} pointController
     * @param {String} overlayType - indicates artwork on bank, either 'flowers' or 'lightning'
     * @param {Object} [options]
     */
    constructor( pointController, overlayType, options ) {

      assert && assert( !options || !options.node, 'options should not include a node for this constructor' );

      const controllerNode = new Node();

      // create a node that is shaped like a piggy bank, the description comes from piggy-bank.svg in the assets file
      const piggyBankOutlineNode = new Path( piggyBankShapes.MEDIUM_PIGGY_BANK_SHAPE, {
        stroke: pointController.numberLinePoint.colorProperty.value,
        lineWidth: 4,
        center: Vector2.ZERO
      } );
      controllerNode.addChild( piggyBankOutlineNode );

      // choose the overlay image source, which is artwork that must exactly match the shape of the outline
      const overlayImageSource = overlayType === 'flowers' ? piggyBankWithFlowers : piggyBankWithLightning;
      const overlayImageNode = new Image( overlayImageSource, { opacity: 0.4 } );
      overlayImageNode.setScaleMagnitude( ( piggyBankOutlineNode.width - OUTLINE_LINE_WIDTH * 2 ) / overlayImageNode.width );
      overlayImageNode.center = Vector2.ZERO;
      controllerNode.addChild( overlayImageNode );

      // add the balance indicator node
      const balanceNode = new Text( 'X', {
        font: new PhetFont( 35 ),
        fill: 'white',
        center: Vector2.ZERO
      } );
      controllerNode.addChild( balanceNode );

      options = _.extend( {
        node: controllerNode
      }, options );

      // update the node's appearance as its position changes
      const maxBalance = pointController.numberLine.displayedRangeProperty.value.max;
      const unscaledWidth = controllerNode.width;
      pointController.positionProperty.link( () => {

        // variables needed to make the updates
        const numberLinePoint = pointController.numberLinePoint;
        const currentBalance = numberLinePoint.valueProperty.value;

        // scale the size
        const desiredWidth = MIN_WIDTH + ( Math.abs( currentBalance ) / maxBalance ) * ( MAX_WIDTH - MIN_WIDTH );
        controllerNode.setScaleMagnitude( desiredWidth / unscaledWidth );

        // update the color of the point and the node's fill
        piggyBankOutlineNode.fill = currentBalance >= 0 ? PIGGY_BANK_GREEN_FILL : PIGGY_BANK_RED_FILL;

        // update the balance indicator text
        const signIndicator = currentBalance < 0 ? '-' : '';
        balanceNode.text = signIndicator + StringUtils.fillIn( moneyAmountString, {
          value: Math.abs( currentBalance )
        } );
        balanceNode.center = Vector2.ZERO;
      } );

      super( pointController, options );
    }
  }

  return numberLineIntegers.register( 'BankPointControllerNode', BankPointControllerNode );
} );