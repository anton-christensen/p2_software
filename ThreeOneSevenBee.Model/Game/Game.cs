﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ThreeOneSevenBee.Model.UI;

using ThreeOneSevenBee.Model.Expression;
#if BRIDGE
using Bridge.Html5;
#endif

namespace ThreeOneSevenBee.Model.Game
{
    public class Game
    {
        IGameAPI gameAPI;
        IContext context;
        GameModel gameModel;
        GameView gameView;

        public Game(IContext context, IGameAPI gameAPI)
        {
            this.gameAPI = gameAPI;
            this.context = context;
        }

        /// <summary>
        /// Starts the game, making sure the user is authenticated and if so, loads up the game.
        /// </summary>
        public void Start()
        {
            // first we check if we are authenticated with the server
            gameAPI.IsAuthenticated((isAuthenticated) =>
            {
                if (isAuthenticated == false)
                {
                    // if we are not, we display the login view, and get the user to connect
                    LoginView loginView = new LoginView(context.Width, context.Height);
                    context.SetContentView(loginView);
                    loginView.OnLogin = (username, password) =>
                    {
                        gameAPI.Authenticate(username, password, (authenticateSuccess) =>
                        {
                            if (authenticateSuccess)
                            {
                                // on succesful login, we load up the game data
                                loadGameData();
                            }
                            else
                            {
                                loginView.ShowLoginError();
                                context.Draw();
                            }
                        });
                    };
                }
                else
                {
                    // if we are, we load up the game data
                    loadGameData();
                }
            });
        }

        private void loadGameData()
        {
            // TODO: Needs comments.
            gameAPI.GetCurrentPlayer((u) =>
            {
                bool unlocked = true;
                for (int index = 0; index < u.Categories.Count; index++)
                {
                    for (int i = 0; i < u.Categories[index].Count; i++)
                    {
							ExpressionSerializer s = new ExpressionSerializer();
							int largeSize = s.Deserialize(u.Categories[index][i].StartExpression).Size;
							int smallSize = 0;
							for(int j = 0; j < u.Categories[index][i].StarExpressions.Count; j++) {
								smallSize = s.Deserialize(u.Categories[index][i].StarExpressions[j]).Size;

								if(smallSize > largeSize) {
									Console.WriteLine ("Error in [{0}-{1}-{2}] : {3}", u.Categories[index].Name, i+1, j, u.Categories[index][i].StarExpressions[j]);
								}
								else
									largeSize = smallSize;
							}
                        u.Categories[index][i].Unlocked = unlocked;
                        if(u.Categories[index][i].Stars == 0 && unlocked == true)
                        {
                            unlocked = false;
                            u.CurrentCategoryIndex = index;
                            u.CurrentLevelIndex = 0;
                        }
                    }
                }
                gameAPI.GetPlayers((p) =>
                {
                    gameModel = new GameModel(u, p)
                    {
                        OnSaveLevel = (level) =>
                        {
                            gameAPI.SaveUserLevelProgress
                            (
                                level.LevelID,
                                level.CurrentExpression,
                                level.Stars,
                                (IsSaved) => 
                                {
                                    Console.WriteLine(IsSaved ? "Level saved" : "Could not save");
                                }
                            );
                        },
                        OnCategoryCompleted = (c) =>
                            gameAPI.UserAddBadge(
                                c.Badge,
                                (IsAdded) => Console.WriteLine(IsAdded ? "Badge added" : "Badge not added")
                            )
                    };

                    gameView = new GameView(gameModel, context.Width, context.Height)
                    {
                        OnExit = () =>
                        {
                            gameAPI.logout((success) =>
                            {
                                Console.WriteLine(success ? "Logout success" : "Logout failed");
                                Start();
                            });
                        },
                        ReloadGame = () => loadGameData()
                    };
                    context.SetContentView(gameView);
                });
            });
        }
    }
}
