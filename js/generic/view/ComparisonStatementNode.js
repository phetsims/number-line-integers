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
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
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

      // the comparison statement has numbers and operators that reside on different root nodes for easier manipulation
      const numberNodesLayer = new Node();
      comparisonStatementRoot.addChild( numberNodesLayer );
      const operatorAndZeroNodesLayer = new Node();
      comparisonStatementRoot.addChild( operatorAndZeroNodesLayer );

      // operator selector node - allows the user to choose between greater than or less than
      const operatorSelectionNode = new OperatorSelectorNode( this.selectedOperatorProperty, {
        bottom: 7 // empirically determined to align vertically with the comparison statement
      } );
      this.addChild( operatorSelectionNode );

      // define a function to update the comparision statement, including its layout
      const updateComparisonStatement = () => {

        const numPoints = numberLine.residentPoints.length;

        // verify that this function isn't being asked to handle more points than it is designed for
        assert && assert( numPoints <= 3, 'too many points on number line' );

        const comparisonOperator = this.selectedOperatorProperty.value;

        // clear out the operators layer
        operatorAndZeroNodesLayer.removeAllChildren();

        // list of all nodes that will depict numbers except for zero values that don't correspond to a point
        const numberNodes = [];

        if ( numberNodesLayer.getChildrenCount() === 0 ) {

          // if there are no points on the number line, just show a zero
          const zeroNode = new Text( '0', { font: COMPARISON_STATEMENT_FONT } );
          operatorAndZeroNodesLayer.addChild( zeroNode );
          numberNodes.push( zeroNode );
        }
        else if ( numberNodesLayer.getChildrenCount() === 1 ) {

          // compare the only point value to zero
          const pointValueNode = numberNodesLayer.getChildAt( 0 );
          const zeroNode = new Text( '0', { font: COMPARISON_STATEMENT_FONT } );
          operatorAndZeroNodesLayer.addChild( zeroNode );
          if ( pointValueNode.point.valueProperty.value < 0 ) {
            numberNodes.push( pointValueNode );
            numberNodes.push( zeroNode );
          }
          else if ( pointValueNode.point.valueProperty.value > 0 ) {
            numberNodes.push( zeroNode );
            numberNodes.push( pointValueNode );
          }
          else {

            // the node value is equal, so sort it based on the previous value
            if ( pointValueNode.previousPointValue !== null && pointValueNode.previousPointValue > 0 ) {
              numberNodes.push( zeroNode );
              numberNodes.push( pointValueNode );
            }
            else {
              numberNodes.push( pointValueNode );
              numberNodes.push( zeroNode );
            }
          }
        }
        else {

          // Get a list of number nodes and sort them based on their value and the current comparison operator.  If the
          // values are equal, use the previous value.
          const orderedNumberNodes = numberNodesLayer.getChildren().sort( ( p1node, p2node ) => {
            let result;
            if ( p1node.point.valueProperty.value !== p2node.point.valueProperty.value ) {
              result = p1node.point.valueProperty.value - p2node.point.valueProperty.value;
            }
            else {

              // the current values are equal, so use the previous value if the point the user is moving if possible
              if ( p1node.point.isDraggingProperty.value && p1node.previousPointValue !== null ) {
                result = p1node.previousPointValue - p2node.point.valueProperty.value;
              }
              else if ( p2node.point.isDraggingProperty.value && p2node.previousPointValue !== null ) {
                result = p2node.previousPointValue - p1node.point.valueProperty.value;
              }
              else {

                // can't figure it out, so just return zero, meaning they are equal
                result = 0;
              }
            }
            return comparisonOperator === '<' ? result : -result;
          } );

          // add the nodes in order to the list of value nodes
          orderedNumberNodes.forEach( node => { numberNodes.push( node ); } );
        }

        // at this point, we should have an ordered list of number nodes, so their position just needs to be set
        let currentXPos = 0;
        for ( let i = 0; i < numberNodes.length; i++ ) {
          const currentNode = numberNodes[ i ];
          currentNode.left = currentXPos;
          currentXPos = currentNode.right + COMPARISON_STATEMENT_SPACING;
          if ( i < numberNodes.length - 1 ) {
            let comparisonCharacter = comparisonOperator;
            const currentNodeValue = currentNode.point ? currentNode.point.valueProperty.value : 0;
            const nextNodeValue = numberNodes[ i + 1 ].point ? numberNodes[ i + 1 ].point.valueProperty.value : 0;
            if ( currentNodeValue === nextNodeValue ) {

              // the values are equal, so we need to use less-than-or-equal or greater-than-or-equal comparison operator
              comparisonCharacter = comparisonOperator === '<' ?
                                    MathSymbols.LESS_THAN_OR_EQUAL :
                                    MathSymbols.GREATER_THAN_OR_EQUAL;
            }
            const comparisonOperatorNode = new Text( comparisonCharacter, {
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
        point.valueProperty.lazyLink( updateComparisonStatement );
      } );
      numberLine.residentPoints.addItemAddedListener( addedPoint => {
        numberNodesLayer.addChild( new PointValueNode( addedPoint ) );
        addedPoint.valueProperty.link( updateComparisonStatement );
      } );
      numberLine.residentPoints.addItemRemovedListener( removedPoint => {
        removedPoint.valueProperty.unlink( updateComparisonStatement );
        numberNodesLayer.getChildren().forEach( childNode => {
          if ( childNode.point === removedPoint ) {
            numberNodesLayer.removeChild( childNode );
            childNode.dispose();
          }
        } );
        updateComparisonStatement();
      } );

      // update the comparison statement of the chosen operator changes, this also does the initial update
      this.selectedOperatorProperty.link( updateComparisonStatement );
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

      // @public (read-only) {number} - the previous value of the point, used in sorting for the comparison expression
      this.previousPointValue = null;

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
      const handleValueChange = ( value, previousValue ) => {
        numberText.text = value;
        background.setRectBounds( numberText.bounds.dilated( 3 ) );
        this.previousPointValue = previousValue;
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