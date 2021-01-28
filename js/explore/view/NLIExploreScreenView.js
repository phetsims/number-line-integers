// Copyright 2019-2020, University of Colorado Boulder

/**
 * main view screen for the "Explore" screen
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import NLIConstants from '../../common/NLIConstants.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NLIScene from '../model/NLIScene.js';
import BankSceneView from './BankSceneView.js';
import ElevationSceneView from './ElevationSceneView.js';
import sceneIconFactory from './sceneIconFactory.js';
import TemperatureSceneView from './TemperatureSceneView.js';

class NLIExploreScreenView extends ScreenView {

  /**
   * @param {NLIExplore} model
   * @public
   */
  constructor( model ) {

    super( { preventFit: true } ); // preventFit used for better performance, see https://github.com/phetsims/number-line-integers/issues/77

    // Create the layer where the controls go.
    const controlsLayer = new Node();
    this.addChild( controlsLayer );

    // Create the root nodes for each of the scenes.
    const elevationScene = new ElevationSceneView( model.elevationSceneModel, this.layoutBounds );
    this.addChild( elevationScene );
    const bankScene = new BankSceneView( model.bankSceneModel, this.layoutBounds );
    this.addChild( bankScene );
    const temperatureScene = new TemperatureSceneView( model.temperatureSceneModel, this.layoutBounds );
    this.addChild( temperatureScene );

    // Control the visibility of the scenes.
    model.selectedSceneProperty.link( selectedScene => {
      elevationScene.visible = selectedScene === NLIScene.ELEVATION;
      bankScene.visible = selectedScene === NLIScene.BANK;
      temperatureScene.visible = selectedScene === NLIScene.TEMPERATURE;
    } );

    // Map the scene selection icons to their enum values (used in the radio button group).
    const sceneSelectionButtonsContent = [
      {
        value: NLIScene.ELEVATION,
        node: sceneIconFactory.getIcon( NLIScene.ELEVATION )
      },
      {
        value: NLIScene.BANK,
        node: sceneIconFactory.getIcon( NLIScene.BANK )
      },
      {
        value: NLIScene.TEMPERATURE,
        node: sceneIconFactory.getIcon( NLIScene.TEMPERATURE )
      }
    ];

    // Create scene selector radio buttons.
    const sceneSelectorRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedSceneProperty,
      sceneSelectionButtonsContent,
      {
        buttonContentXMargin: 5,
        buttonContentYMargin: 5,
        touchAreaXDilation: 3,
        touchAreaYDilation: 3,
        left: this.layoutBounds.maxX - NLIConstants.EXPLORE_SCREEN_CONTROLS_LEFT_SIDE_INSET,
        bottom: this.layoutBounds.maxY - 107,
        baseColor: 'white',
        selectedLineWidth: 2,
        deselectedLineWidth: .5,
        deselectedButtonOpacity: 0.25,
        orientation: 'horizontal',
        spacing: 7
      }
    );
    controlsLayer.addChild( sceneSelectorRadioButtonGroup );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
        elevationScene.reset();
        bankScene.reset();
        temperatureScene.reset();
      },
      right: this.layoutBounds.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLCConstants.SCREEN_VIEW_Y_MARGIN
    } );
    controlsLayer.addChild( resetAllButton );
  }
}

numberLineIntegers.register( 'NLIExploreScreenView', NLIExploreScreenView );
export default NLIExploreScreenView;