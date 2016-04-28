﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ThreeOneSevenBee.Model.Game;

namespace ThreeOneSevenBee.Model.UI
{
    public class PlayerListView : CompositeView
    {

        public Dictionary<BadgeName, string> badgeDictionary = new Dictionary<BadgeName, string>()
        {
            {BadgeName.brokBadge, "brøkbadge.png"},
            {BadgeName.masterOfAlgebra, "master_of_algebrabadge.png"},
            {BadgeName.potens, "potens_badge.png"},
            {BadgeName.tutorialBadge, "tutorialbadge.png" },
            {BadgeName.spilDoneBadge, "parantes_badge.png"}

        };
        public void Build(IEnumerable<Player> players)
        {
            Children = new List<View>();
			int offsetY = 5;

			List<Player> sortedPlayers = new List<Player> (players);

			sortedPlayers.Sort(delegate(Player p1, Player p2) {
				return p1.Badges.Count.CompareTo(p2.Badges.Count);
			});

            foreach (Player player in sortedPlayers)
            {
                int badgesWidth = (badgeDictionary.Count-1) * 10;
                CompositeView row = new CompositeView(Width, 20)
                    {
                        new LabelView(" " + player.PlayerName + " ")
                        {
                            Width = Width - badgesWidth - 20,
                            Height = 20,
                        },
                    };
                foreach (var badge in player.Badges)
                {
                    row.Add(new ImageView(badgeDictionary[badge], 10, 10)
                    {
                        X = Width - badgesWidth + 20,
                        Y = 5
                    });
                    badgesWidth += 10;
                }

                row.X = 5;
                row.Y = offsetY;
                row.Width = Width - 10;
                row.BackgroundColor = new Color(239, 239, 239);
                Children.Add(row);

                offsetY += 25;
            }
        }

        public void Update(IEnumerable<Player> players)
        {
            Build(players);
        }

        public PlayerListView(IEnumerable<Player> players, double width, double height) : base(width, height)
        {
            Build(players);
            BackgroundColor = new Color(209, 209, 209);
        }

        public PlayerListView(double width, double height) : base(width, height)
        {

        }
    }
}
