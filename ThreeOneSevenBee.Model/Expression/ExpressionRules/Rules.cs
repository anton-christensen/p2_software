﻿using System;
using System.Collections.Generic;
using ThreeOneSevenBee.Model.Expression.Expressions;
using ThreeOneSevenBee.Model.Expression;
using System.Linq;
using System.Text;

namespace ThreeOneSevenBee.Model.Expression.ExpressionRules
{
    public static class Rules
    {
        public static bool ItselfRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            identity = expression.Clone();
            return true;
        }

        // Commutative Rule: a + b = b + a
        public static bool CommutativeRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            VariadicOperatorExpression operatorExpression = expression as VariadicOperatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if(operatorExpression != null && selection.Count == 2)
            {
                if (operatorExpression.Type == OperatorType.Add || operatorExpression.Type == OperatorType.Multiply)
                {
                    if (selection[0].Parent == expression && selection[1].Parent == expression)
                    {
                        VariadicOperatorExpression temp = operatorExpression.Clone() as VariadicOperatorExpression;
                        for (int index = 0; index < operatorExpression.Count; index++)
                        {
                            if (ReferenceEquals(operatorExpression[index], selection[0]))
                            {
                                temp[index] = selection[1].Clone();
                            }
                            if (ReferenceEquals(operatorExpression[index], selection[1]))
                            {
                                temp[index] = selection[0].Clone();
                            }
                            temp[index].Parent = temp;
                        }
                        identity = temp;
                        return true;
                    }
                }
            }
            identity = null;
            return false;
        }

        // a^-n = 1/(a)^n
        public static bool InversePowerRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            identity = null;

            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Power)
                {
                    if (operatorExpression.Right is UnaryMinusExpression)
                    {
                        UnaryMinusExpression power = operatorExpression.Right as UnaryMinusExpression;
                        BinaryOperatorExpression newDivision = serializer.Deserialize("1/b") as BinaryOperatorExpression;
                        BinaryOperatorExpression newPower = serializer.Deserialize("a^b") as BinaryOperatorExpression;
                        newPower.Left = operatorExpression.Left;
                        newPower.Right = power.Expression;
                        newDivision.Right = newPower;
                        identity = newDivision;
                        return true;
                    }
                }
            }
            return false;
        }

        // a^0 = 1
        public static bool PowerZeroRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Power)
                {
                    if (operatorExpression.Right.Value.Equals("0"))
                    {
                        identity = serializer.Deserialize("1");
                        return true;
                    }
                }
            }
            identity = null;
            return false;
        }

        // a/c + b/c = (a+b)/c
        public static bool FractionAddRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Add)
                {
                    BinaryOperatorExpression lefthand, righthand;
                    if ((lefthand = operatorExpression.Left as BinaryOperatorExpression) != null &&
                       (righthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Divide && righthand.Type == OperatorType.Divide)
                        {
                            if (lefthand.Right == righthand.Right)
                            {
                                BinaryOperatorExpression newDivision = serializer.Deserialize("a/b") as BinaryOperatorExpression;
                                BinaryOperatorExpression newAddition = serializer.Deserialize("a+b") as BinaryOperatorExpression;
                                newAddition.Left = lefthand.Left;
                                newAddition.Right = righthand.Left;
                                newDivision.Left = newAddition;
                                newDivision.Right = lefthand.Right;
                                identity = newDivision;
                                return true;
                            }
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // a/b * c/d = a*c/(b*d)
        public static bool FractionMultiplyRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Multiply)
                {
                    BinaryOperatorExpression lefthand, righthand;
                    if ((lefthand = operatorExpression.Left as BinaryOperatorExpression) != null &&
                       (righthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Divide && righthand.Type == OperatorType.Divide)
                        {
                            BinaryOperatorExpression division = serializer.Deserialize("a/b") as BinaryOperatorExpression;

                            division.Left = (serializer.Deserialize(serializer.Serialize(lefthand.Left) + "*" + serializer.Serialize(righthand.Left)));
                            division.Right = (serializer.Deserialize(serializer.Serialize(lefthand.Right) + "*" + serializer.Serialize(righthand.Right)));
                            identity = division;
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // (a)^n * (a)^p = a^(n+p)
        public static bool SameVariableDifferentExpMultiplyRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Multiply)
                {
                    BinaryOperatorExpression lefthand, righthand;
                    if ((lefthand = operatorExpression.Left as BinaryOperatorExpression) != null &&
                        (righthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Power && righthand.Type == OperatorType.Power)
                        {
                            if (lefthand.Left == righthand.Left)
                            {
                                // May be missing parenthesis 
                                identity = serializer.Deserialize(serializer.Serialize(lefthand.Left) + "^" +
                                           serializer.Serialize(lefthand.Right) + "+" +
                                           serializer.Serialize(righthand.Right));
                                return true;
                            }
                        }
                    }
                }
            }
            identity = null;
            return false;
        }
        // a^n^n
        public static bool VariableWithTwoExponent(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Power)
                {
                    BinaryOperatorExpression lefthand;
                    if ((lefthand = operatorExpression.Left as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Power)
                        {
                            identity = serializer.Deserialize(serializer.Serialize(lefthand.Left) + "^" +
                                       serializer.Serialize(lefthand.Right) + "*" +
                                       serializer.Serialize(operatorExpression.Right));
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }
        // (a+b)^2 = a^2+b^2+2ab
        public static bool SquareSentenceRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Power && operatorExpression.Right.Value.Equals("2"))
                {
                    BinaryOperatorExpression lefthand;
                    if ((lefthand = operatorExpression.Left as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Add)
                        {
                            identity = serializer.Deserialize(serializer.Serialize(lefthand.Left) + "^" +
                                       serializer.Serialize(operatorExpression.Right) + "+" +
                                       serializer.Serialize(lefthand.Right) + "^" +
                                       serializer.Serialize(operatorExpression.Right) + "+" +
                                       serializer.Serialize(operatorExpression.Right) + "*" +
                                       serializer.Serialize(lefthand.Left) + "*" +
                                       serializer.Serialize(lefthand.Right));
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }
        // sqrt(a^2) = a
        public static bool SquareRootAndPowerRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            FunctionExpression functionExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            BinaryOperatorExpression operatorExpression;
            DelimiterExpression delimiterExpression;
            if ((functionExpression = expression as FunctionExpression) != null)
            {
                if (functionExpression.Function == "sqrt")
                {
                    if ((delimiterExpression = functionExpression.Expression as DelimiterExpression) != null)
                    {
                        if ((operatorExpression = delimiterExpression.Expression as BinaryOperatorExpression) != null)
                        {

                            if (operatorExpression.Type == OperatorType.Power && operatorExpression.Right.Value.Equals("2"))
                            {
                                identity = operatorExpression.Left;
                                return true;
                            }
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // a * b/c = a*b/c
        public static bool FractionVariableMultiplyRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Multiply)
                {
                    BinaryOperatorExpression righthand;
                    // Skal der ikke tjekkes for:  && operatorExpression.Left is VariableExpression i nedenstående?
                    if ((righthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (righthand.Type == OperatorType.Divide)
                        {
                            identity = serializer.Deserialize("a/" + serializer.Serialize(righthand.Left));
                            identity.Replace(serializer.Deserialize("a"), serializer.Deserialize(serializer.Serialize(operatorExpression.Left) + "*" + serializer.Serialize(righthand.Left)));
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // a * (b + c) = a*b + a*c
        public static bool MultiplyVariableIntoParentheses(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Multiply)
                {
                    BinaryOperatorExpression righthand;
                    if ((righthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (righthand.Type == OperatorType.Multiply)
                        {
                            identity = serializer.Deserialize(serializer.Serialize(operatorExpression.Left) + "*" + serializer.Serialize(righthand.Left) +
                            "+" + serializer.Serialize(operatorExpression.Left) + "*" + serializer.Serialize(righthand.Right));
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // (a * b)^n = a^n + b^n
        public static bool PowerOfVariablesMultiplied(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Power)
                {
                    BinaryOperatorExpression lefthand;
                    if ((lefthand = operatorExpression.Right as BinaryOperatorExpression) != null)
                    {
                        if (lefthand.Type == OperatorType.Multiply)
                        {
                            identity = serializer.Deserialize(serializer.Serialize(lefthand.Left) + "^" + serializer.Serialize(operatorExpression.Right) +
                            "+" + serializer.Serialize(lefthand.Right) + "^" + serializer.Serialize(operatorExpression.Right));
                            return true;
                        }
                    }
                }
            }
            identity = null;
            return false;
        }

        // 1 * a = a V a * 1 = a
        public static bool MultiplyingWithOneRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Multiply && operatorExpression.Left.Value.Equals("1"))
                {
                    identity = operatorExpression.Right;
                    return true;
                }
                else if ((operatorExpression.Type == OperatorType.Multiply && operatorExpression.Right.Value.Equals("1")))
                {
                    identity = operatorExpression.Left;
                    return true;
                }
            }
            identity = null;
            return false;
        }

        // b/1 = b
        public static bool DenumeratorIsOneRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Divide)
                {
                    if (operatorExpression.Right.Value.Equals("1"))
                    {
                        identity = operatorExpression.Left;
                        return true;
                    }
                }
            }
            identity = null;
            return false;
        }

        // 0/b = 0
        public static bool NumeratorIsZero(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Divide)
                {
                    if (operatorExpression.Left.Value.Equals("0"))
                    {
                        identity = serializer.Deserialize("0");
                        return true;
                    }
                }
            }
            identity = null;
            return false;
        }

        // -a/-b = a/b
        public static bool RemovingUnaryMinusInDivisionRule(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            BinaryOperatorExpression operatorExpression;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as BinaryOperatorExpression) != null)
            {
                if (operatorExpression.Type == OperatorType.Divide)
                {
                    if ((operatorExpression.Left is UnaryMinusExpression) && operatorExpression.Right is UnaryMinusExpression)
                    {
                        UnaryMinusExpression terminal = operatorExpression.Left as UnaryMinusExpression;
                        UnaryMinusExpression terminal2 = operatorExpression.Right as UnaryMinusExpression;
                        identity = serializer.Deserialize(serializer.Serialize(terminal.Expression) + "/" + terminal2.Expression);
                        return true;
                    }
                }
            }
            identity = null;
            return false;
        }

        // --b = b
        public static bool DoubleMinusEqualsPlus(ExpressionBase expression, List<ExpressionBase> selection, out ExpressionBase identity)
        {
            UnaryMinusExpression operatorExpression;
            UnaryMinusExpression unary1;
            ExpressionSerializer serializer = new ExpressionSerializer();
            if ((operatorExpression = expression as UnaryMinusExpression) != null)
            {
                if ((unary1 = operatorExpression.Expression as UnaryMinusExpression) != null)
                {
                    identity = serializer.Deserialize(serializer.Serialize(unary1.Expression));
                    return true;
                }
            }
            identity = null;
            return false;
        }
    }
}