// Copyright 2019, University of Colorado Boulder

/**
 * PointNode is a Scenery node that portrays number line points in the view.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const ColorizedReadoutNode = require( 'NUMBER_LINE_INTEGERS/common/view/ColorizedReadoutNode' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const StringProperty = require( 'AXON/StringProperty' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  const POINT_NODE_RADIUS = 4.5; // in screen coordinates

  class PointNode extends Node {

    /**
     * @param {NumberLinePoint} numberLinePoint
     * @param {NumberLine} numberLine
     * @param {Object} [options]
     * @public
     */
    constructor( numberLinePoint, numberLine, options ) {

      options = merge( {

        // {boolean} - if true, the label text will match the color of the point, if false the label text will be black
        usePointColorForLabelText: true,

        // {boolean} - if true, the label background will be based on the point color, if false the background will have
        // a black stroke and white interior
        colorizeLabelBackground: false,

        // {string} - template to be used when displaying the label
        labelTemplate: '{{number}}',

        // {Font}
        labelFont: new PhetFont( 18 ),

        // true if this point is the opposite of another number line point
        isDoppelganger: false
      }, options );

      super();

      // add the small circle that will represent the point
      const circle = new Circle( POINT_NODE_RADIUS, {
        fill: numberLinePoint.colorProperty,
        stroke: options.isDoppelganger ? 'gray' : numberLinePoint.colorProperty
      } );
      this.addChild( circle );

      // create the property that will contain the label text
      const labelTextProperty = new StringProperty( '' );

      // function for updating the label text
      const updateLabelText = value => {
        let stringValue = StringUtils.fillIn( options.labelTemplate, { value: Math.abs( value ) } );
        if ( value < 0 ) {
          stringValue = MathSymbols.UNARY_MINUS + stringValue;
        }
        labelTextProperty.set( stringValue );
      };

      // create a background and add the label text to it
      const pointLabelNode = new ColorizedReadoutNode( labelTextProperty, numberLinePoint.colorProperty, {
        colorizeBackground: options.colorizeLabelBackground,
        colorizeText: options.usePointColorForLabelText
      } );

      // add the label and link a listener for visibility
      this.addChild( pointLabelNode );
      const labelVisibilityListener = numberLine.showLabelsProperty.linkAttribute( pointLabelNode, 'visible' );

      // move in front of other points when being dragged or when the point value is being changed by other means
      const moveToFrontMultilink = Property.multilink(
        [ numberLinePoint.isDraggingProperty, numberLinePoint.valueProperty ],
        () => { this.moveToFront(); }
      );

      // update the point representation as it moves
      const updatePointRepresentationMultilink = Property.multilink(
        [
          numberLinePoint.valueProperty,
          numberLine.showOppositesProperty,
          numberLine.orientationProperty,
          numberLine.displayedRangeProperty
        ],
        ( value, oppositesVisible ) => {
          if ( options.isDoppelganger ) {
            value = -value;
            this.visible = oppositesVisible;
          }
          circle.center = numberLine.valueToModelPosition( value );

          // update the point label text and position
          updateLabelText( value );
          if ( numberLine.isHorizontal ) {
            pointLabelNode.centerX = circle.centerX;
            pointLabelNode.bottom = circle.y - 20;
          }
          else {
            pointLabelNode.right = circle.x - 20;
            pointLabelNode.centerY = circle.centerY;
          }
        }
      );

      /**
       * @private
       */
      this.disposePointNode = () => {
        numberLine.showLabelsProperty.unlinkAttribute( labelVisibilityListener );
        updatePointRepresentationMultilink.dispose();
        moveToFrontMultilink.dispose();
        pointLabelNode.dispose();
      };
    }

    // @public
    dispose() {
      this.disposePointNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'PointNode', PointNode );
} );
