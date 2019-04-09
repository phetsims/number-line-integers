// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Color = require( 'SCENERY/util/Color' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

  class NLIGenericScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super( { layoutBounds: NLIConstants.NLI_BOUNDS } );

      const pointControllerBoxNode = new Rectangle( model.pointControllerBox, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.addChild( pointControllerBoxNode );

      // TODO: temporary faked out number line representation
      const numberLineNode = new ArrowNode( -350, 0, 350, 0, {
        doubleHead: true,
        tailWidth: 0.5,
        headHeight: 6,
        headWidth: 6,
        stroke: 'black',
        fill: 'black'
      } );
      numberLineNode.center = this.layoutBounds.center;
      this.addChild( numberLineNode );


      // points
      const pointControllerNode1 = new PointControllerNode( { baseColor: new Color( 'orange' ) } );
      pointControllerNode1.center = numberLineNode.center;
      this.addChild( pointControllerNode1 );
      const pointControllerNode2 = new PointControllerNode( { baseColor: new Color( 'blue' ) } );
      pointControllerNode2.centerX = numberLineNode.left + 50;
      pointControllerNode2.centerY = numberLineNode.centerY;
      this.addChild( pointControllerNode2 );
      const pointControllerNode3 = new PointControllerNode( { baseColor: new Color( 'magenta' ) } );
      pointControllerNode3.centerX = numberLineNode.right - 50;
      pointControllerNode3.centerY = numberLineNode.centerY;
      this.addChild( pointControllerNode3 );

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
} );