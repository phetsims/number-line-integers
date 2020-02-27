// Copyright 2019-2020, University of Colorado Boulder

/**
 * PointNode is a Scenery node that portrays number line points in the view.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import ColorizedReadoutNode from './ColorizedReadoutNode.js';

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
      colorizeText: options.usePointColorForLabelText,
      textOptions: {
        font: new PhetFont( 18 ),
        maxWidth: 60 // empirically determined to work in all currently needed cases
      }
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

numberLineIntegers.register( 'PointNode', PointNode );
export default PointNode;