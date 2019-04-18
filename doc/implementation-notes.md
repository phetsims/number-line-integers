TODO finalize implementation overview

No MVT - model space and view space are the same

Because a number line has no real size, the model units are essentially arbitrary.  With
this in mind, a decision was made to keep the model-view relationship simple and have the
model and view space be the same.  So, there is no model-view transform (MVT) at all.

If there ever comes a day when we need an MVT (say, if the pinch-and-zoom feature depends
on there being one), probably the best thing to do would be to assume that the number
line exists in a normalized space of 1x1, and all coordinates are transformed into this
space based on the number line's orientation and displayed range value.  An MVT in the
view would then project it into the appropriate place in the view.