// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const RandomIconFactory = require( 'NUMBER_LINE_INTEGERS/common/view/RandomIconFactory' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

  // images
  const elevationBackground = require( 'image!NUMBER_LINE_INTEGERS/elevation-background.png' );

  // constants
  const INSET = 10;
  const ICON_FACTORY = new RandomIconFactory( 900005 );

  class NLIScenesScreenView extends ScreenView {

    /**
     * @param {NLIScenes} model
     */
    constructor( model ) {

      super();

      // create the root nodes for each of the scenes
      const elevationSceneNode = new Node();
      this.addChild( elevationSceneNode );
      const bankSceneNode = new Node();
      this.addChild( bankSceneNode );
      const temperatureSceneNode = new Node();
      this.addChild( temperatureSceneNode );

      // control the visibility of the scenes
      model.selectedSceneProperty.link( selectedScene => {
        elevationSceneNode.visible = selectedScene === NLIScene.ELEVATION;
        bankSceneNode.visible = selectedScene === NLIScene.BANK;
        temperatureSceneNode.visible = selectedScene === NLIScene.TEMPERATURE;
      } );

      // add the background to the elevations scene
      elevationSceneNode.addChild( new Image( elevationBackground, {
        maxWidth: 500,
        centerX: this.layoutBounds.centerX,
        centerY: this.layoutBounds.centerY
      } ) );

      // map the scene selection icons to their enum values (used in the radio buton group)
      const orientationButtonsContent = [
        {
          value: NLIScene.ELEVATION,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        },
        {
          value: NLIScene.BANK,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        },
        {
          value: NLIScene.TEMPERATURE,
          node: ICON_FACTORY.createIcon().setScaleMagnitude( 0.07, 0.1 )
        }
      ];

      // create scene selector radio buttons
      const sceneSelectorRadioButtonGroup = new RadioButtonGroup(
        model.selectedSceneProperty,
        orientationButtonsContent,
        {
          buttonContentXMargin: 5,
          buttonContentYMargin: 5,
          right: this.layoutBounds.maxX - INSET,
          bottom: this.layoutBounds.maxY - 100,
          baseColor: 'white',
          selectedLineWidth: 2,
          deselectedLineWidth: .5,
          deselectedButtonOpacity: 0.25,
          orientation: 'horizontal',
          spacing: 10
        }
      );
      this.addChild( sceneSelectorRadioButtonGroup );


      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - INSET,
        bottom: this.layoutBounds.maxY - INSET
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreenView', NLIScenesScreenView );
} );