// Copyright 2019, University of Colorado Boulder

/**
 * a Scenery node that depicts a "comparison statement" between zero to three values, for example, "1 < 5 < 7".  It
 * also include a selector that allows users to choose between the greater than or less than comparison operator.
 *
 * @author John Blanco
 */
define( require => {
  'use strict';

  // modules
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Text = require( 'SCENERY/nodes/Text' );

  class ComparisonStatementNode extends Node {

    /**
     *
     * @param {NumberLine} numberLine - the number line whose point values are being depicted
     */
    constructor( numberLine ) {

      super();

      const comparisonStatement = new Text( '0', { font: new PhetFont( 22 ) } );
      this.addChild( comparisonStatement );

      // define a function to update the comparision statement based on the points on the number line
      const updateComparisonStatement = () => {

        const numPoints = numberLine.residentPoints.length;

        // this indicator handles a max of three points
        assert && assert( numPoints <= 3, 'too many points on number line' );

        const comparisonOperator = '<';
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
          numberList.sort();

          // update the text
          for ( let i = 0; i < numberList.length - 1; i++ ) {
            comparisonText += numberList[ i ] + ' ' + comparisonOperator + ' ';
          }
          comparisonText += numberList[ numberList.length - 1 ];
        }
        comparisonStatement.text = comparisonText;
        comparisonStatement.centerX = 0;
      };

      // do an initial update of the comparison statement
      updateComparisonStatement();

      // update the comparison statement as points appear, move, and disappear
      numberLine.residentPoints.forEach( point => {
        point.valueProperty.lazyLink( updateComparisonStatement );
      } );
      numberLine.residentPoints.addItemAddedListener( addedPoint => {
        addedPoint.valueProperty.link( updateComparisonStatement );
      } );
      numberLine.residentPoints.addItemRemovedListener( removedPoint => {
        removedPoint.valueProperty.unlink( updateComparisonStatement );
        updateComparisonStatement();
      } );
    }

  }

  return numberLineIntegers.register( 'ComparisonStatementNode', ComparisonStatementNode );
} );