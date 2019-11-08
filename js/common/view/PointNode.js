// Copyright 2019, University of Colorado Boulder

/**
 * PointNode is a Scenery node that portrays number line points in the view.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BackgroundNode = require( 'SCENERY_PHET/BackgroundNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const merge = require( 'PHET_CORE/merge' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const POINT_NODE_RADIUS = 4.5;

  class PointNode extends Node {

    /**
     * @param {NumberLinePoint} numberLinePoint
     * @param {NumberLine} numberLine
     * @param {Object} [options]
     * @public
     */
    constructor( numberLinePoint, numberLine, options ) {

      options = merge( {
        isDoppelganger: false,
        customColorsForLabels: true,
        numberDisplayTemplate: '{{number}}',
        labelFont: new PhetFont( 18 )
      }, options );

      super();

      // add the small circle that will represent the point
      const circle = new Circle( POINT_NODE_RADIUS, {
        fill: numberLinePoint.colorProperty,
        stroke: options.isDoppelganger ? 'gray' : numberLinePoint.colorProperty
      } );
      this.addChild( circle );

      const getLabelText = value => {
        let stringValue = StringUtils.fillIn( options.numberDisplayTemplate, { value: Math.abs( value ) } );
        if ( value < 0 ) {
          stringValue = MathSymbols.UNARY_MINUS + stringValue;
        }
        return stringValue;
      };
      const pointLabelTextNode = new Text( getLabelText( numberLinePoint.valueProperty.value ), {
        font: options.labelFont,
        fill: options.customColorsForLabels ? numberLinePoint.colorProperty : 'black',
        maxWidth: 75 // TODO: this seems a bit hardcoded; fix
      } );

      // create a background and add the label text to it
      const pointLabelNode = new BackgroundNode( pointLabelTextNode, NLIConstants.LABEL_BACKGROUND_OPTIONS );

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
        [ numberLinePoint.valueProperty,
          numberLine.showOppositesProperty,
          numberLine.orientationProperty,
          numberLine.displayedRangeProperty
        ], ( value, oppositesVisible ) => {
          if ( options.isDoppelganger ) {
            value = -value;
            this.visible = oppositesVisible;
          }
          circle.center = numberLine.valueToModelPosition( value );

          // update the point label text and position
          pointLabelTextNode.text = getLabelText( value );
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
