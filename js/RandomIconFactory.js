// Copyright 2019, University of Colorado Boulder

/**
 * an object that, once instantiated (and thus seeded), can be used to generate random icons for use in PhET simulations
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Random = require( 'DOT/Random' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Screen = require( 'JOIST/Screen' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const NUM_SHAPES = 2;
  const NUM_SEGMENTS_PER_SHAPE = 5;

  /**
   * @constructor
   * {number} [seed] - optional seed for the random number generator
   */
  function RandomIconFactory( seed ) {
    this.random = new Random( { seed: seed } );
  }

  numberLineIntegers.register( 'RandomIconFactory', RandomIconFactory );

  return inherit( Object, RandomIconFactory, {

    /**
     * create a random icon with an optional caption
     * @param {String} [caption]
     */
    createIcon: function( caption ) {
      const self = this;
      const maxX = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
      const maxY = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;

      // add the background
      const background = new Rectangle( 0, 0, maxX, maxY, 0, 0, {
        fill: this.generateRandomLinearGradient( maxX, maxY )
      } );

      // set a clip area, since sometimes the random control points can cause the shape to go outside the icon bounds
      background.clipArea = new Shape.rect( 0, 0, maxX, maxY );

      // create the artwork
      _.times( NUM_SHAPES, function() {
        const shape = self.generateRandomShape( NUM_SEGMENTS_PER_SHAPE, maxX, maxY );
        background.addChild( new Path( shape, {
          fill: self.generateRandomLinearGradient( maxX, maxY ),
          stroke: self.generateRandomColor()
        } ) );
      } );

      // add the caption, if specified
      if ( caption ) {
        const captionNode = new Text( caption, {
          fill: 'white',
          stroke: 'black',
          font: new PhetFont( 40 ) // size empirically determined for one character, scaled to fit below
        } );
        const wScale = ( ( background.width * 0.9 ) / captionNode.width );
        const hScale = ( ( background.height * 0.9 ) / captionNode.height );
        captionNode.scale( Math.min( wScale, hScale ) );
        captionNode.centerX = background.width / 2;
        captionNode.centerY = background.height / 2;
        background.addChild( captionNode );
      }

      return background;
    },

    // @private, function to generate a random color
    generateRandomColor: function() {
      const r = Math.floor( this.random.nextDouble() * 256 );
      const g = Math.floor( this.random.nextDouble() * 256 );
      const b = Math.floor( this.random.nextDouble() * 256 );
      return new Color( r, g, b );
    },

    // utility function to generate a random linear gradient
    generateRandomLinearGradient: function( maxX, maxY ) {
      const vertical = this.random.nextDouble() > 0.5;
      let gradient;
      if ( vertical ) {
        gradient = new LinearGradient( this.random.nextDouble() * maxX, 0, this.random.nextDouble() * maxX, maxY );
      }
      else {
        gradient = new LinearGradient( 0, this.random.nextDouble() * maxY, maxX, this.random.nextDouble() * maxY );
      }
      gradient.addColorStop( 0, this.generateRandomColor() );
      gradient.addColorStop( 1, this.generateRandomColor() );
      return gradient;
    },

    // utility function to generate a random point
    generateRandomPoint: function( maxX, maxY ) {
      return new Vector2( this.random.nextDouble() * maxX, this.random.nextDouble() * maxY );
    },

    // utility function to generate a random shape segment
    addRandomSegment: function( shape, maxX, maxY ) {
      const decider = this.random.nextDouble();
      const endpoint = this.generateRandomPoint( maxX, maxY );
      let controlPoint1;
      let controlPoint2;
      if ( decider < 0.33 ) {
        // add a line segment
        shape.lineToPoint( endpoint );
      }
      else if ( decider < 0.66 ) {
        // add a quadratic curve
        controlPoint1 = this.generateRandomPoint( maxX, maxY );
        shape.quadraticCurveTo( controlPoint1.x, controlPoint1.y, endpoint.x, endpoint.y );
      }
      else {
        // add a cubic curve
        controlPoint1 = this.generateRandomPoint( maxX, maxY );
        controlPoint2 = this.generateRandomPoint( maxX, maxY );
        shape.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endpoint.x, endpoint.y );
      }
    },

    // utility function to generate random shape
    generateRandomShape: function( numSegments, maxX, maxY ) {
      const shape = new Shape();
      shape.moveToPoint( this.generateRandomPoint( maxX, maxY ) );
      for ( let i = 0; i < numSegments; i++ ) {
        this.addRandomSegment( shape, maxX, maxY );
      }
      shape.close();
      return shape;
    }

  } );
} );