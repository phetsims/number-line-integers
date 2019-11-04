// Copyright 2019, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Checkbox = require( 'SUN/Checkbox' );
  const ComboBox = require( 'SUN/ComboBox' );
  const ComboBoxItem = require( 'SUN/ComboBoxItem' );
  const ComparisonStatementAccordionBox = require( 'NUMBER_LINE_INTEGERS/common/view/ComparisonStatementAccordionBox' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NLIGenericModel = require( 'NUMBER_LINE_INTEGERS/generic/model/NLIGenericModel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const NumberLineOrientation = require( 'NUMBER_LINE_INTEGERS/common/model/NumberLineOrientation' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const absoluteValueString = require( 'string!NUMBER_LINE_INTEGERS/absoluteValue' );
  const labelsString = require( 'string!NUMBER_LINE_INTEGERS/labels' );
  const tickMarksString = require( 'string!NUMBER_LINE_INTEGERS/tickMarks' );
  const oppositeString = require( 'string!NUMBER_LINE_INTEGERS/opposite' );
  const rangeString = require( 'string!NUMBER_LINE_INTEGERS/range' );

  // constants
  const CHECKBOX_DILATION = 6;
  const ARROW_ICON_LENGTH = 40;
  const COMBO_BOX_FONT = new PhetFont( 16 );
  const ORIENTATION_BUTTON_DILATION = 2;
  const CHECKBOX_OPTIONS = { boxWidth: NLIConstants.CHECKBOX_BOX_WIDTH };

  class NLIGenericScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super( { layoutBounds: NLIConstants.NLI_LAYOUT_BOUNDS } );

      // layer where controls are added
      const controlsLayer = new Node();
      this.addChild( controlsLayer );

      // add the display of the inequality
      const comparisonStatementAccordionBox = new ComparisonStatementAccordionBox( model.numberLine );
      controlsLayer.addChild( comparisonStatementAccordionBox );

      // add the check boxes that will control the number line's presentation
      const checkboxes = [
        new Checkbox(
          new Text( labelsString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          model.numberLine.labelsVisibleProperty,
          CHECKBOX_OPTIONS
        ),
        new Checkbox(
          new Text( tickMarksString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          model.numberLine.tickMarksVisibleProperty,
          CHECKBOX_OPTIONS
        ),
        new Checkbox(
          new Text( oppositeString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          model.numberLine.oppositesVisibleProperty,
          CHECKBOX_OPTIONS
        ),
        new Checkbox(
          new Text( absoluteValueString, NLIConstants.CHECKBOX_TEXT_OPTIONS ),
          model.numberLine.showAbsoluteValuesProperty,
          CHECKBOX_OPTIONS
        )
      ];
      const checkboxGroup = new VBox( {
        children: checkboxes,
        spacing: 15,
        align: 'left',
        left: this.layoutBounds.maxX - 220,
        top: this.layoutBounds.minY + 10
      } );
      controlsLayer.addChild( checkboxGroup );

      // expands the touch area for the checkboxes
      checkboxes.forEach( checkbox => { checkbox.touchArea = checkbox.localBounds.dilated( CHECKBOX_DILATION ); } );

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
        pointControllerLayer.addChild( new PointControllerNode( pointController ) );
      } );

      // add the number line node
      this.addChild( new NumberLineNode( model.numberLine, {
        showAbsoluteValueSpans: true,
        pointNodeOptions: {
          labelFont: new PhetFont( 18 )
        }
      } ) );

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
          comparisonStatementAccordionBox.reset();
        },
        right: this.layoutBounds.maxX - NLIConstants.RESET_BUTTON_INSET_FROM_EDGE,
        bottom: this.layoutBounds.maxY - NLIConstants.RESET_BUTTON_INSET_FROM_EDGE
      } );
      controlsLayer.addChild( resetAllButton );

      // orientation radio buttons
      const orientationRadioButtonGroup = new RadioButtonGroup(
        model.numberLine.orientationProperty,
        orientationButtonsContent,
        {
          buttonContentXMargin: 5,
          buttonContentYMargin: 5,
          left: checkboxGroup.left,
          bottom: resetAllButton.bottom - 20,
          baseColor: 'white',
          selectedLineWidth: 2,
          deselectedLineWidth: .5,
          deselectedButtonOpacity: 0.25,
          orientation: 'horizontal',
          spacing: 12,
          touchAreaXDilation: ORIENTATION_BUTTON_DILATION,
          touchAreaYDilation: ORIENTATION_BUTTON_DILATION
        } );
      controlsLayer.addChild( orientationRadioButtonGroup );

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
              { font: COMBO_BOX_FONT, maxWidth: this.layoutBounds.width * 0.15 }
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
          left: orientationRadioButtonGroup.left,
          bottom: orientationRadioButtonGroup.top - 12,
          buttonTouchAreaXDilation: 7,
          buttonTouchAreaYDilation: 7
        }
      );
      controlsLayer.addChild( rangeSelectionComboBox );
    }
  }

  return numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
} );
