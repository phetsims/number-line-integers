// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that depicts a "comparison statement" between zero to three numerical values, for example,
 * "1 < 5 < 7".  It also includes a selector that allows a user to choose between the greater than or less than
 * comparison operator.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const ButtonListener = require( 'SCENERY/input/ButtonListener' );
  const Easing = require( 'TWIXT/Easing' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const StringProperty = require( 'AXON/StringProperty' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  const COMPARISON_STATEMENT_FONT = new PhetFont( 22 );
  const COMPARISON_STATEMENT_SPACING = 6; // in screen coords

  class ComparisonStatementNode extends Node {

    /**
     * @param {NumberLine} numberLine - the number line whose point values are being depicted
     */
    constructor( numberLine ) {

      super();

      // @private {StringProperty} - controls what comparison operator is used
      this.selectedOperatorProperty = new StringProperty( '<' );

      // comparison statement root node
      const comparisonStatementRoot = new Node();
      this.addChild( comparisonStatementRoot );

      // the comparison statement has numbers and operators that reside on different nodes for easier manipulation
      const numberNodesLayer = new Node();
      comparisonStatementRoot.addChild( numberNodesLayer );
      const operatorAndZeroNodesLayer = new Node();
      comparisonStatementRoot.addChild( operatorAndZeroNodesLayer );

      // operator selector node
      const operatorSelectionNode = new OperatorSelectorNode( this.selectedOperatorProperty, {
        bottom: 7 // empirically determined to align vertically with the comparison statement
      } );
      this.addChild( operatorSelectionNode );

      // define a function to update the comparision statement and the layout
      const update = () => {

        const numPoints = numberLine.residentPoints.length;

        // this indicator node handles a max of three points, make sure that's all that are present
        assert && assert( numPoints <= 3, 'too many points on number line' );

        const comparisonOperator = this.selectedOperatorProperty.value;

        // clear out the operators layer
        operatorAndZeroNodesLayer.removeAllChildren();

        // list of all value nodes that will be shown, kept in ascending order
        const valueNodes = [];

        if ( numberNodesLayer.getChildrenCount() === 0 ) {

          // if there are no points on the number line, just show a zero
          const zeroNode = new Text( '0', { font: COMPARISON_STATEMENT_FONT } );
          operatorAndZeroNodesLayer.addChild( zeroNode );
          valueNodes.push( zeroNode );
        }
        else if ( numberNodesLayer.getChildrenCount() === 1 ) {

          // compare the only point value to zero
          const pointValueNode = numberNodesLayer.getChildAt( 0 );
          const zeroNode = new Text( '0', { font: COMPARISON_STATEMENT_FONT } );
          operatorAndZeroNodesLayer.addChild( zeroNode );
          if ( pointValueNode.point.valueProperty.value < 0 ) {
            valueNodes.push( pointValueNode );
            valueNodes.push( zeroNode );
          }
          else {
            valueNodes.push( zeroNode );
            valueNodes.push( pointValueNode );
          }
        }
        else {

          // get a list of number nodes and sort them based on their value
          const orderedNumberNodes = numberNodesLayer.getChildren().sort( ( p1node, p2node ) => {
            const p1Value = p1node.point.valueProperty.value;
            const p2Value = p2node.point.valueProperty.value;
            return comparisonOperator === '<' ? p1Value - p2Value : p2Value - p1Value;
          } );

          // add the nodes in order to the list of value nodes
          orderedNumberNodes.forEach( node => { valueNodes.push( node ); } );
        }

        // position the value nodes and put the operators in between
        let currentXPos = 0;
        for ( let i = 0; i < valueNodes.length; i++ ) {
          const index = comparisonOperator === '<' ? i : valueNodes.length - i - 1;
          valueNodes[ index ].x = currentXPos;
          currentXPos = valueNodes[ index ].right + COMPARISON_STATEMENT_SPACING;
          if ( i < valueNodes.length - 1 ) {
            const comparisonOperatorNode = new Text( comparisonOperator, {
              font: COMPARISON_STATEMENT_FONT,
              x: currentXPos
            } );
            operatorAndZeroNodesLayer.addChild( comparisonOperatorNode );
            currentXPos = comparisonOperatorNode.right + COMPARISON_STATEMENT_SPACING;
          }
        }

        comparisonStatementRoot.centerX = 0;
        operatorSelectionNode.left = 90; // empirically determined
      };

      // update the comparison statement as points appear, move, and disappear
      numberLine.residentPoints.forEach( point => {
        numberNodesLayer.addChild( new PointValueNode( point ) );
        point.valueProperty.lazyLink( update );
      } );
      numberLine.residentPoints.addItemAddedListener( addedPoint => {
        numberNodesLayer.addChild( new PointValueNode( addedPoint ) );
        addedPoint.valueProperty.link( update );
      } );
      numberLine.residentPoints.addItemRemovedListener( removedPoint => {
        removedPoint.valueProperty.unlink( update );
        numberNodesLayer.getChildren().forEach( childNode => {
          if ( childNode.point === removedPoint ) {
            numberNodesLayer.removeChild( childNode );
            childNode.dispose();
          }
        } );
        update();
      } );

      // update the comparison statement of the chosen operator changes, this also does the initial update
      this.selectedOperatorProperty.link( update );
    }

    reset() {
      this.selectedOperatorProperty.reset();
    }
  }

  // inner class that defines the operator selector control
  class OperatorSelectorNode extends Node {

    /**
     * @param {StringProperty} selectedOperatorProperty - property controlled by this selector node
     * @param {Object} [options]
     */
    constructor( selectedOperatorProperty, options ) {

      options = _.extend( {
        selectorWidth: 30,
        selectorHeight: 30,
        font: new PhetFont( 20 ),
        roundedCornerRadius: 5
      }, options );

      super();

      // create the button for selecting the "less than" operator
      const lessThanSelectorShape = Shape.roundedRectangleWithRadii(
        -options.selectorWidth,
        -options.selectorHeight / 2,
        options.selectorWidth,
        options.selectorHeight,
        { topLeft: options.roundedCornerRadius, bottomLeft: options.roundedCornerRadius }
      );
      const lessThanOperatorSelectorNode = new Path( lessThanSelectorShape, {
        stroke: 'black',
        cursor: 'pointer'
      } );
      const lessThanText = new Text( '<', {
        font: options.font,
        centerX: lessThanOperatorSelectorNode.centerX,
        centerY: 0
      } );
      lessThanOperatorSelectorNode.addChild( lessThanText );
      lessThanOperatorSelectorNode.addInputListener( new ButtonListener( {
        fire: () => {
          selectedOperatorProperty.set( '<' );
        }
      } ) );
      this.addChild( lessThanOperatorSelectorNode );

      // create the button for selecting the "greater than" operator
      const greaterThanSelectorShape = Shape.roundedRectangleWithRadii(
        0,
        -options.selectorHeight / 2,
        options.selectorWidth,
        options.selectorHeight,
        { topRight: options.roundedCornerRadius, bottomRight: options.roundedCornerRadius }
      );
      const greaterThanOperatorSelectorNode = new Path( greaterThanSelectorShape, {
        stroke: 'black',
        cursor: 'pointer'
      } );
      const greaterThanText = new Text( '>', {
        font: options.font,
        centerX: greaterThanOperatorSelectorNode.centerX,
        centerY: 0
      } );
      greaterThanOperatorSelectorNode.addChild( greaterThanText );
      greaterThanOperatorSelectorNode.addInputListener( new ButtonListener( {
        fire: () => {
          selectedOperatorProperty.set( '>' );
        }
      } ) );
      this.addChild( greaterThanOperatorSelectorNode );

      // control the appearance of each selector based on the current selection state
      selectedOperatorProperty.link( selection => {
        if ( selection === '<' ) {
          lessThanOperatorSelectorNode.fill = 'lightgray';
          lessThanOperatorSelectorNode.stroke = 'gray';
          lessThanText.stroke = 'gray';
          greaterThanOperatorSelectorNode.fill = 'white';
          greaterThanOperatorSelectorNode.stroke = 'black';
          greaterThanText.stroke = 'black';
        }
        else {
          lessThanOperatorSelectorNode.fill = 'white';
          lessThanOperatorSelectorNode.stroke = 'black';
          lessThanText.stroke = 'black';
          greaterThanOperatorSelectorNode.fill = 'lightgray';
          greaterThanOperatorSelectorNode.stroke = 'gray';
          greaterThanText.stroke = 'gray';
        }
      } );

      this.mutate( options );
    }
  }

  // inner class that is used to portray the numerical value of a number line point
  class PointValueNode extends Node {

    /**
     * @param {NumberLinePoint} point
     */
    constructor( point ) {

      super();

      // @public (read-only) {NumberLinePoint}
      this.point = point;

      // background - initial size is arbitrary, it will be updated in function linked below
      const background = new Rectangle( 0, 0, 1, 1, 2, 2, {
        fill: point.colorProperty.value.colorUtilsBrighter( 0.75 ),
        stroke: point.colorProperty.value,
        lineWidth: 2,
        visible: false // initially invisible, activated (made visible) when user interacts with the point
      } );
      this.addChild( background );

      // the node that represents the value
      const numberText = new Text( '', { font: COMPARISON_STATEMENT_FONT } );
      this.addChild( numberText );

      // update appearance as the value changes
      const handleValueChange = value => {
        numberText.text = value;
        background.setRectBounds( numberText.bounds.dilated( 3 ) );
      };
      point.valueProperty.link( handleValueChange );

      // an animation is used to made the background when the user stops dragging the point
      let backgroundFadeAnimation = null;

      // update the highlight state as the point is dragged
      const handleDragStateChange = dragging => {

        if ( dragging ) {
          if ( backgroundFadeAnimation ) {
            backgroundFadeAnimation.stop();
          }
          background.visible = true;
          background.opacity = 1;
        }
        else {

          if ( !backgroundFadeAnimation ) {

            // start or restart the fade animation
            backgroundFadeAnimation = new Animation( {
              duration: 0.75,
              easing: Easing.CUBIC_OUT,
              setValue: value => { background.opacity = value; },
              from: 1,
              to: 0
            } );
            backgroundFadeAnimation.start();
            backgroundFadeAnimation.endedEmitter.addListener( () => {
              backgroundFadeAnimation = null;
              background.visible = false;
            } );
          }
        }
      };
      point.isDraggingProperty.link( handleDragStateChange );

      // @private {function}
      this.disposeNumberWithColorNode = () => {
        point.valueProperty.unlink( handleValueChange );
        point.isDraggingProperty.unlink( handleDragStateChange );
      };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeNumberWithColorNode();
      super.dispose();
    }
  }

  return numberLineIntegers.register( 'ComparisonStatementNode', ComparisonStatementNode );
} );