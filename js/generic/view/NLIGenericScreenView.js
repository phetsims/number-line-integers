// Copyright 2019, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const ComparisonStatementNode = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementNode' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NLIGenericModel = require( 'NUMBER_LINE_INTEGERS/generic/model/NLIGenericModel' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  const CHECK_BOX_FONT = new PhetFont( 20 );
  const ARROW_ICON_LENGTH = 40;
  const COMBO_BOX_FONT = new PhetFont( 14 );
  const COMPARISON_STATEMENT_BOX_WIDTH = 300; // empirically determined to look decent

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const comparisonStatementString = require( 'string!NUMBER_LINE_INTEGERS/comparisonStatement' );
  const labelsString = require( 'string!NUMBER_LINE_INTEGERS/labels' );
  const tickMarksString = require( 'string!NUMBER_LINE_INTEGERS/tickMarks' );
  const oppositeString = require( 'string!NUMBER_LINE_INTEGERS/opposite' );
  const rangeString = require( 'string!NUMBER_LINE_INTEGERS/range' );

  class NLIGenericScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super( { layoutBounds: NLIConstants.NLI_LAYOUT_BOUNDS } );

      // add the display of the inequality
      const comparisonStatementNode = new ComparisonStatementNode( model.numberLine );

      // TODO: If the options for the accordion box are the same through all usages of the sim, create a class that
      // inherits from accordion box and implements all of this (to avoid code duplication).
      const comparisonStatementAccordionBox = new AccordionBox( comparisonStatementNode, {
        fill: 'white',
        titleNode: new Text( comparisonStatementString, {
          font: new PhetFont( 16 ),
          maxWidth: COMPARISON_STATEMENT_BOX_WIDTH * 0.8
        } ),
        showTitleWhenExpanded: false,
        cornerRadius: 5,
        contentAlign: 'right',
        centerX: this.layoutBounds.centerX,
        top: 10,
        minWidth: COMPARISON_STATEMENT_BOX_WIDTH,
        maxWidth: COMPARISON_STATEMENT_BOX_WIDTH
      } );
      this.addChild( comparisonStatementAccordionBox );

      // add the check boxes that will control the number line's presentation
      this.addChild( new VBox( {
        children: [
          new Checkbox(
            new Text( labelsString, { font: CHECK_BOX_FONT } ),
            model.numberLine.labelsVisibleProperty
          ),
          new Checkbox(
            new Text( tickMarksString, { font: CHECK_BOX_FONT } ),
            model.numberLine.tickMarksVisibleProperty
          ),
          new Checkbox(
            new Text( oppositeString, { font: CHECK_BOX_FONT } ),
            model.numberLine.oppositesVisibleProperty
          ),
          new Checkbox(
            new Text( absoluteValueString, { font: CHECK_BOX_FONT } ),
            model.numberLine.showAbsoluteValuesProperty
          )
        ],
        spacing: 15,
        align: 'left',
        left: this.layoutBounds.maxX - 250,
        top: this.layoutBounds.minY + 10
      } ) );

      const arrowIconOptions = {
        doubleHead: true,
        tailWidth: 1
      };

      // create the orientation selection icons
      const horizontalIcon = new ArrowNode( -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, 0, arrowIconOptions );
      const verticalIcon = new ArrowNode( 0, -ARROW_ICON_LENGTH / 2, 0, ARROW_ICON_LENGTH / 2, arrowIconOptions );

      // map the orientation icons to their enum values
      const orientationButtonsContent = [
        {
          value: NumberLineOrientation.HORIZONTAL,
          node: horizontalIcon
        },
        {
          value: NumberLineOrientation.VERTICAL,
          node: verticalIcon
        }
      ];

      // NOTE: There is no model-view transform for this sim. Model and view space use the same coordinate system.

      // root node on which the point controllers will live
      const pointControllerLayer = new Node();
      this.addChild( pointControllerLayer );

      // add the point controller nodes
      model.pointControllers.forEach( pointController => {
        const pointControllerNode = new PointControllerNode( pointController );
        pointControllerLayer.addChild( pointControllerNode );
        pointController.positionProperty.link( () => { pointControllerNode.moveToFront(); } );
      } );

      // add the number line node
      this.addChild( new NumberLineNode( model.numberLine, { showAbsoluteValueSpans: true } ) );

      let pointControllerBoxNode = null;
      model.pointControllerBoxProperty.link( pointControllerBox => {
        pointControllerBoxNode && this.removeChild( pointControllerBoxNode );

        // add the box where the point controllers hang out when not in use
        pointControllerBoxNode = new Rectangle( pointControllerBox, {
          fill: 'white',
          stroke: 'black',
          cornerRadius: 6
        } );

        this.addChild( pointControllerBoxNode );
        pointControllerBoxNode.moveToBack();
      } );

      // reset all button
      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
          comparisonStatementNode.reset();
          comparisonStatementAccordionBox.expandedProperty.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );

      // orientation radio buttons
      const orientationRadioButtonGroup = new RadioButtonGroup(
        model.numberLine.orientationProperty,
        orientationButtonsContent,
        {
          buttonContentXMargin: 5,
          buttonContentYMargin: 5,
          right: resetAllButton.right,
          bottom: resetAllButton.top - 10,
          baseColor: 'white',
          selectedLineWidth: 2,
          deselectedLineWidth: .5,
          deselectedButtonOpacity: 0.25,
          orientation: 'horizontal',
          spacing: 10
        } );
      this.addChild( orientationRadioButtonGroup );

      // create the selection items for the range selection combo box
      const rangeSelectionComboBoxItems = [];
      NLIGenericModel.NUMBER_LINE_RANGES.forEach( range => {
        rangeSelectionComboBoxItems.push(
          new ComboBoxItem(
            new Text(
              StringUtils.fillIn( rangeString, {
                lowValue: range.min,
                highValue: range.max
              } ),
              { font: COMBO_BOX_FONT }
            ),
            range
          )
        );
      } );

      // combo box for selecting the range
      const rangeSelectionComboBox = new ComboBox(
        rangeSelectionComboBoxItems,
        model.numberLine.displayedRangeProperty,
        this,
        {
          xMargin: 13,
          yMargin: 6,
          cornerRadius: 4,
          right: resetAllButton.right,
          bottom: orientationRadioButtonGroup.top - 10
        }
      );
      this.addChild( rangeSelectionComboBox );
    }
  }

  return numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
} );