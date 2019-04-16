// Copyright 2019, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const Color = require( 'SCENERY/util/Color' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const POINT_CONTROLLER_COLOR_LIST = [ new Color( 'blue' ), new Color( 'magenta' ), new Color( 'orange' ) ];
  const CHECK_BOX_FONT = new PhetFont( 20 );

  // strings
  const tickMarksString = require( 'string!NUMBER_LINE_INTEGERS/tickMarks' );

  class NLIGenericScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super( { layoutBounds: NLIConstants.NLI_BOUNDS } );

      // add the check boxes that will control the number line's presentation
      const checkboxAreaUpperLeft = new Vector2( this.layoutBounds.maxX - 300, this.layoutBounds.minY + 10 );
      this.addChild( new Checkbox(
        new Text( tickMarksString, { font: CHECK_BOX_FONT } ),
        model.numberLine.tickMarksVisibleProperty,
        {
          left: checkboxAreaUpperLeft.x,
          top: checkboxAreaUpperLeft.y
        }
      ) );

      // NOTE: There is no model-view transform for this sim.  Model and view space use the same coordinate system.

      // define the bounds within which the number line will size itself in the horizontal and vertical directions
      const numberLineBounds = this.layoutBounds.dilated( -70 );

      // add the number line node
      this.addChild( new NumberLineNode( model.numberLine, numberLineBounds ) );

      // add the box where the point controllers hang out when not in use
      const pointControllerBoxNode = new Rectangle( model.pointControllerBox, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.addChild( pointControllerBoxNode );

      // add the point controller nodes
      assert && assert( model.pointControllers.length === POINT_CONTROLLER_COLOR_LIST.length );
      model.pointControllers.forEach( ( pointController, index ) => {
        this.addChild( new PointControllerNode( pointController, { baseColor: POINT_CONTROLLER_COLOR_LIST[ index ] } ) );
      } );

      // reset all button
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