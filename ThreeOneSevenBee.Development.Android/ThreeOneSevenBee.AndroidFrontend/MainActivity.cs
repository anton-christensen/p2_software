﻿using System;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using ThreeOneSevenBee.Model.Game;
using ThreeOneSevenBee.Model.UI;
using System.Net;
using System.IO;
using System.Linq;
using Android.Util;
using Org.Json;
using System.Collections.Generic;
using Android.Views.InputMethods;

namespace ThreeOneSevenBee.AndroidFrontend
{
    [Activity(Label = "A317b Webmat", ConfigurationChanges = Android.Content.PM.ConfigChanges.Orientation, WindowSoftInputMode = SoftInput.AdjustResize, MainLauncher = true, Icon = "@drawable/master_of_algebrabadge", ScreenOrientation = Android.Content.PM.ScreenOrientation.Landscape)]
    public class MainActivity : Activity
    {
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            RequestWindowFeature(WindowFeatures.NoTitle);
            this.Window.AddFlags(WindowManagerFlags.Fullscreen);

            InputMethodManager input = (InputMethodManager)GetSystemService(Activity.InputMethodService);

            AndroidContext context = new AndroidContext(this, input, Resources.DisplayMetrics.WidthPixels, Resources.DisplayMetrics.HeightPixels);

            IGameAPI gameAPI = new AndroidGameAPI();

            Game game = new Game(context, gameAPI);

            game.Start();

            SetContentView(context);
        }
    }
}

