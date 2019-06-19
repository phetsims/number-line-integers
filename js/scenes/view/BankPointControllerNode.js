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
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const MIN_WIDTH = 70; // screen coords, empirically determined
  const MAX_WIDTH = 180; // screen coords, empirically determined
  const PIGGY_BANK_GREEN_FILL = new Color( 77, 177, 148 );
  const PIGGY_BANK_RED_FILL = new Color( 235, 66, 44 );

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
      const piggyBankOutlineNode = new Path(
        'M471.262,415.361c-3,15.5-13.5,47-41.5,66c0,0-16,7.5-24.5,32.5\n' +
        '\tc0,0,2.5,7-20.5,7s-19.5-6-19.5-6s-2-10.5-32-9.5c-27.503,0.916-33-3-43.5,0s-11.5,11-11.5,11s-2,4.5-20,4c0,0-20.5,2-21.5-6.5\n' +
        '\ts-9-20.5-15.5-24.5s-26-15.5-34.5-29s-32-16-32-16s-11.5,0.5-14-9s-2.5-43.5-2.5-43.5s-0.5-10.5,12-13s18.5-13,18.5-13\n' +
        '\ts4.615-16.491,17.957-34.329c-1.664-10.116-1.207-19.638,4.043-24.421c0.972-0.886,2.2-1.551,3.612-2.05\n' +
        '\tc-1.293-9.036-1.856-21.138,3.388-25.282c8.75-6.917,34.917,8.333,41.667,11.833c0,0,1.269,0.984,1.718,1.117\n' +
        '\tc5.673-1.913,75.15-24.218,156.115,2.132c13.926,4.532,25.339,10.428,34.698,17.174c2.614-2.025,8.027-1.944,13.425,0.698\n' +
        '\tc2.977-1.024,7.253-0.278,13.332,4.709c0,0,6.274,6.274,2.091,12.133c-0.2,0.281-0.421,0.534-0.654,0.764\n' +
        '\tc1.419,4.26,0.534,7.22-1.983,9.94C476.816,371.247,473.151,405.6,471.262,415.361z',
        {
          stroke: pointController.numberLinePoint.colorProperty.value,
          lineWidth: 8,
          center: Vector2.ZERO
        }
      );
      controllerNode.addChild( piggyBankOutlineNode );

      const overlayImageSource = overlayType === 'flowers' ? piggyBankWithFlowers : piggyBankWithLightning;
      const overlayImageNode = new Image( overlayImageSource, { opacity: 0.4 } );
      overlayImageNode.setScaleMagnitude( piggyBankOutlineNode.width / overlayImageNode.width );
      overlayImageNode.center = Vector2.ZERO;
      controllerNode.addChild( overlayImageNode );

      // add the balance indicator node
      const balanceNode = new Text( 'X', {
        font: new PhetFont( 80 ),
        fill: 'white',
        center: Vector2.ZERO
      } );
      controllerNode.addChild( balanceNode );

      options = _.extend( {
        node: controllerNode
      }, options );

      // update the node as its position changes
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