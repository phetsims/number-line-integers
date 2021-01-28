// Copyright 2019-2020, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import NLIConstants from '../../common/NLIConstants.js';
import ComparisonStatementAccordionBox from '../../common/view/ComparisonStatementAccordionBox.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import numberLineIntegersStrings from '../../numberLineIntegersStrings.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NLIGenericModel from '../model/NLIGenericModel.js';
import NumberLineOrientationSelector from '../../../../number-line-common/js/common/view/NumberLineOrientationSelector.js';

// constants
const absoluteValueString = numberLineIntegersStrings.absoluteValue;
const labelsString = numberLineIntegersStrings.labels;
const tickMarksString = numberLineIntegersStrings.tickMarks;
const oppositeString = numberLineIntegersStrings.opposite;

class NLIGenericScreenView extends ScreenView {

  /**
   * @param {NLIGenericModel} model
   * @public
   */
  constructor( model ) {

    super( { layoutBounds: NLIConstants.NLI_LAYOUT_BOUNDS } );

    // layer where controls are added
    const controlsLayer = new Node();
    this.addChild( controlsLayer );

    // Add the display of the inequality.
    const comparisonStatementAccordionBox = new ComparisonStatementAccordionBox( model.numberLine, {
      centerX: this.layoutBounds.centerX,
      top: 10
    } );
    controlsLayer.addChild( comparisonStatementAccordionBox );

    // Add the check boxes that will control the number line's presentation.
    const checkboxes = [
      new NLCheckbox( labelsString, model.numberLine.showPointLabelsProperty ),
      new NLCheckbox( tickMarksString, model.numberLine.showTickMarksProperty ),
      new NLCheckbox( oppositeString, model.numberLine.showOppositesProperty ),
      new NLCheckbox( absoluteValueString, model.numberLine.showAbsoluteValuesProperty )
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

    // NOTE: There is no model-view transform for this sim. Model and view space use the same coordinate system.

    // root node on which the point controllers will live
    const pointControllerLayer = new Node();
    this.addChild( pointControllerLayer );

    // Add the point controller nodes.
    model.pointControllers.forEach( pointController => {
      pointControllerLayer.addChild( new PointControllerNode( pointController ) );
    } );

    // Add the number line node.
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

      // Add the box where the point controllers hang out when not in use.
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
      right: this.layoutBounds.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLCConstants.SCREEN_VIEW_Y_MARGIN
    } );
    controlsLayer.addChild( resetAllButton );

    const orientationSelector = new NumberLineOrientationSelector( model.numberLine.orientationProperty, {
      left: checkboxGroup.left,
      bottom: resetAllButton.centerY
    } );
    controlsLayer.addChild( orientationSelector );

    // number line range selector
    controlsLayer.addChild( new NumberLineRangeSelector(
      model.numberLine.displayedRangeProperty,
      NLIGenericModel.NUMBER_LINE_RANGES,
      this,
      {
        left: orientationSelector.left,
        bottom: orientationSelector.top - 12
      }
    ) );
  }
}

numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
export default NLIGenericScreenView;
