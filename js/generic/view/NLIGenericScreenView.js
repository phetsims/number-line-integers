// Copyright 2019-2020, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NLIConstants from '../../common/NLIConstants.js';
import ComparisonStatementAccordionBox from '../../common/view/ComparisonStatementAccordionBox.js';
import PointControllerNode from '../../common/view/PointControllerNode.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineIntegersStrings from '../../numberLineIntegersStrings.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NLIGenericModel from '../model/NLIGenericModel.js';

const absoluteValueString = numberLineIntegersStrings.absoluteValue;
const labelsString = numberLineIntegersStrings.labels;
const tickMarksString = numberLineIntegersStrings.tickMarks;
const oppositeString = numberLineIntegersStrings.opposite;

// constants
const ARROW_ICON_LENGTH = 40;
const ORIENTATION_BUTTON_DILATION = 2;

class NLIGenericScreenView extends ScreenView {

  /**
   * @param {NumberLineIntegersModel} model
   * @public
   */
  constructor( model ) {

    super( { layoutBounds: NLIConstants.NLI_LAYOUT_BOUNDS } );

    // layer where controls are added
    const controlsLayer = new Node();
    this.addChild( controlsLayer );

    // add the display of the inequality
    const comparisonStatementAccordionBox = new ComparisonStatementAccordionBox( model.numberLine, {
      centerX: this.layoutBounds.centerX,
      top: 10
    } );
    controlsLayer.addChild( comparisonStatementAccordionBox );

    // add the check boxes that will control the number line's presentation
    const checkboxes = [
      new Checkbox(
        new Text( labelsString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showPointLabelsProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( tickMarksString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showTickMarksProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( oppositeString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showOppositesProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( absoluteValueString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.numberLine.showAbsoluteValuesProperty,
        NLCConstants.CHECKBOX_OPTIONS
      )
    ];
    const checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: 15,
      align: 'left',

      // position - empirically determined to look decent
      left: this.layoutBounds.maxX - 220,
      top: this.layoutBounds.minY + 10
    } );
    controlsLayer.addChild( checkboxGroup );

    // expands the touch area for the checkboxes
    checkboxes.forEach( checkbox => {
      checkbox.touchArea = checkbox.localBounds.dilated( NLCConstants.CHECKBOX_DILATION );
    } );

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
        value: Orientation.HORIZONTAL,
        node: horizontalIcon
      },
      {
        value: Orientation.VERTICAL,
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
    this.addChild( new SpatializedNumberLineNode( model.numberLine, {
      showAbsoluteValueSpans: true,
      displayedRangeInset: NLIConstants.GENERIC_SCREEN_DISPLAYED_RANGE_INSET,
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
        this.interruptSubtreeInput();
        model.reset();
        comparisonStatementAccordionBox.reset();
      },
      right: this.layoutBounds.maxX - NLCConstants.RESET_BUTTON_INSET_FROM_EDGE,
      bottom: this.layoutBounds.maxY - NLCConstants.RESET_BUTTON_INSET_FROM_EDGE
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

    // number line range selector
    controlsLayer.addChild( new NumberLineRangeSelector(
      model.numberLine.displayedRangeProperty,
      NLIGenericModel.NUMBER_LINE_RANGES,
      this,
      {
        left: orientationRadioButtonGroup.left,
        bottom: orientationRadioButtonGroup.top - 12
      }
    ) );
  }
}

numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
export default NLIGenericScreenView;