// Copyright 2023, University of Colorado Boulder

/**
 * ExploreScreenIcon places all the screenIcons of different region and culture representations into a single Node.
 * Each icon's visibility is controlled by the regionAndCulturePortrayalProperty.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ScreenIcon from '../../../../joist/js/ScreenIcon.js';
import ExplorerImages from '../../common/view/ExplorerImages.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import { Node, Image } from '../../../../scenery/js/imports.js';

export default class ExploreScreenIcon extends ScreenIcon {

  /**
   *
   * @param { Property<RegionAndCulturePortrayal> }regionAndCulturePortrayalProperty
   * @param { 'nav' | 'home' }iconType
   */
  constructor( regionAndCulturePortrayalProperty, iconType ) {

    const exploreScreenImages = ExplorerImages.EXPLORER_CHARACTER_SETS.map( set => {
      const screenImage = iconType === 'nav' ? set.screenNavIcon : set.screenHomeIcon;
      return new Image( screenImage, {
        visibleProperty: new DerivedProperty( [ regionAndCulturePortrayalProperty ], portrayal => {
          return portrayal === set;
        } )
      } );
    } );

    const screenIconNode = new Node( {
      children: exploreScreenImages
    } );
    super( screenIconNode, { maxIconWidthProportion: 1, maxIconHeightProportion: 1 } );
  }
}

numberLineIntegers.register( 'ExploreScreenIcon', ExploreScreenIcon );