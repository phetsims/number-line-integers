// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that depicts a "comparison statement" between zero to three numerical values, for example,
 * "1 < 5 < 7".  It also include a selector that allows a user to choose between the greater than or less than
 * comparison operator.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const ButtonListener = require( 'SCENERY/input/ButtonListener' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const StringProperty = require( 'AXON/StringProperty' );
  const Text = require( 'SCENERY/nodes/Text' );

  class ComparisonStatementNode extends Node {

    /**
     * @param {NumberLine} numberLine - the number line whose point values are being depicted
     */
    constructor( numberLine ) {

      super();

      // @private {StringProperty} - controls what comparison operator is used
      this.selectedOperatorProperty = new StringProperty( '<' );

      // comparison statement
      const comparisonStatement = new Text( '0', { font: new PhetFont( 22 ) } );
      this.addChild( comparisonStatement );

      // operator selector node
      const operatorSelectionNode = new OperatorSelectorNode( this.selectedOperatorProperty, {
        centerY: comparisonStatement.centerY
      } );
      this.addChild( operatorSelectionNode );

      // define a function to update the comparision statement and the layout
      const update = () => {

        const numPoints = numberLine.residentPoints.length;

        // this indicator handles a max of three points
        assert && assert( numPoints <= 3, 'too many points on number line' );

        const comparisonOperator = this.selectedOperatorProperty.value;
        const numberList = [];

        numberLine.residentPoints.forEach( point => {
          numberList.push( point.valueProperty.value );
        } );

        let comparisonText = '';
        if ( numberList.length === 0 ) {

          // if there are no points, just show a zero
          comparisonText = '0';
        }
        else {

          // if there is only one point on the line, add a zero to compare to
          if ( numberList.length === 1 ) {
            numberList.push( 0 );
          }

          // sort the list based on the comparison that will be depicted
          numberList.sort( ( a, b ) => {
            return comparisonOperator === '<' ? a - b : b - a;
          } );

          // update the text
          for ( let i = 0; i < numberList.length - 1; i++ ) {
            comparisonText += numberList[ i ] + ' ' + comparisonOperator + ' ';
          }
          comparisonText += numberList[ numberList.length - 1 ];
        }
        comparisonStatement.text = comparisonText;
        comparisonStatement.centerX = 0;
        operatorSelectionNode.left = 80; // empirically determined
      };

      // do an initial update of the comparison statement
      update();

      // update the comparison statement as points appear, move, and disappear
      numberLine.residentPoints.forEach( point => {
        point.valueProperty.lazyLink( update );
      } );
      numberLine.residentPoints.addItemAddedListener( addedPoint => {
        addedPoint.valueProperty.link( update );
      } );
      numberLine.residentPoints.addItemRemovedListener( removedPoint => {
        removedPoint.valueProperty.unlink( update );
        update();
      } );

      // update the comparison statement of the chosen operator changes
      this.selectedOperatorProperty.lazyLink( update );
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

  return numberLineIntegers.register( 'ComparisonStatementNode', ComparisonStatementNode );
} );