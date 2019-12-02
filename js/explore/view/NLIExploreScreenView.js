// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BankSceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/BankSceneView' );
  const ElevationSceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/ElevationSceneView' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/explore/model/NLIScene' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const sceneIconFactory = require( 'NUMBER_LINE_INTEGERS/explore/view/sceneIconFactory' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const TemperatureSceneView = require( 'NUMBER_LINE_INTEGERS/explore/view/TemperatureSceneView' );

  class NLIExploreScreenView extends ScreenView {

    /**
     * @param {NLIExplore} model
     * @public
     */
    constructor( model ) {

      super();

      // create the layer where the controls go
      const controlsLayer = new Node();
      this.addChild( controlsLayer );

      // create the root nodes for each of the scenes
      const elevationScene = new ElevationSceneView( model.elevationSceneModel, this.layoutBounds );
      this.addChild( elevationScene );
      const bankScene = new BankSceneView( model.bankSceneModel, this.layoutBounds );
      this.addChild( bankScene );
      const temperatureScene = new TemperatureSceneView( model.temperatureSceneModel, this.layoutBounds );
      this.addChild( temperatureScene );

      // control the visibility of the scenes
      model.selectedSceneProperty.link( selectedScene => {
        elevationScene.visible = selectedScene === NLIScene.ELEVATION;
        bankScene.visible = selectedScene === NLIScene.BANK;
        temperatureScene.visible = selectedScene === NLIScene.TEMPERATURE;
      } );

      // map the scene selection icons to their enum values (used in the radio button group)
      const orientationButtonsContent = [
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

      // create scene selector radio buttons
      const sceneSelectorRadioButtonGroup = new RadioButtonGroup(
        model.selectedSceneProperty,
        orientationButtonsContent,
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
          model.reset();
          elevationScene.reset();
          bankScene.reset();
          temperatureScene.reset();
        },
        right: this.layoutBounds.maxX - NLIConstants.RESET_BUTTON_INSET_FROM_EDGE,
        bottom: this.layoutBounds.maxY - NLIConstants.RESET_BUTTON_INSET_FROM_EDGE
      } );
      controlsLayer.addChild( resetAllButton );
    }
  }

  return numberLineIntegers.register( 'NLIExploreScreenView', NLIExploreScreenView );
} );
