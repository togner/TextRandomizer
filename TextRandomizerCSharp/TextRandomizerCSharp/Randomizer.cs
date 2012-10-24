using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TextRandomizerCSharp
{
    public static class Randomizer
    {
        public static string Randomize(string original, RandomizerSettings settings)
        {
            if (string.IsNullOrWhiteSpace(original))
            {
                return original;
            }

            if (settings.ConsonantSwaps == 0 && settings.VowelSwaps == 0)
            {
                return original;
            }

            Dictionary<char, char> _consonantSwapMap = null;
            Dictionary<char, char> _vowelSwapMap = null;
            if (settings.ConsonantSwaps > 0)
            {
                IEnumerable<char> _langConsonants = settings.LanguageSet.Consonants;

                // get distinct consonants
                HashSet<char> _textConsonants = new HashSet<char>(original.ToLowerInvariant().Where(_c => _langConsonants.Contains(_c)).Distinct());

                // max swaps = min of user defined swaps, consonant pairs in language set, actual number of consonants in text
                int _maxSwaps = Math.Min(settings.ConsonantSwaps, _langConsonants.Count() / 2);
                _maxSwaps = Math.Min(_maxSwaps, _textConsonants.Count);

                _consonantSwapMap = Randomizer.BuildSwapMap(_textConsonants, _langConsonants, _maxSwaps, settings.MultiLevelSwaps);
            }
            if (settings.VowelSwaps > 0)
            {
                IEnumerable<char> _langVowels = settings.LanguageSet.Vowels;
                HashSet<char> _textVowels = new HashSet<char>(original.ToLowerInvariant().Where(_c => _langVowels.Contains(_c)).Distinct());
                int _maxSwaps = Math.Min(settings.VowelSwaps, _langVowels.Count() / 2);
                _maxSwaps = Math.Min(_maxSwaps, _textVowels.Count);
                _vowelSwapMap = Randomizer.BuildSwapMap(_textVowels, _langVowels, _maxSwaps, settings.MultiLevelSwaps);
            }

            string _result = Randomizer.Swap(original, _consonantSwapMap, _vowelSwapMap);
            return _result;
        }

        private static string Swap(string original, Dictionary<char, char> consonantSwapMap, Dictionary<char, char> vowelSwapMap)
        {
            // transform
            StringBuilder _transformedStringBuilder = new StringBuilder();
            foreach (char _c in original)
            {
                char _transformedChar = _c;
                if (consonantSwapMap != null)
                {
                    if (consonantSwapMap.ContainsKey(_c))
                    {
                        _transformedChar = consonantSwapMap[_c];
                    }
                    else if (consonantSwapMap.ContainsKey(char.ToLowerInvariant(_c)))
                    {
                        _transformedChar = char.ToUpperInvariant(consonantSwapMap[char.ToLowerInvariant(_c)]);
                    }
                }
                if (vowelSwapMap != null)
                {
                    if (vowelSwapMap.ContainsKey(_c))
                    {
                        _transformedChar = vowelSwapMap[_c];
                    }
                    else if (vowelSwapMap.ContainsKey(char.ToLowerInvariant(_c)))
                    {
                        _transformedChar = char.ToUpperInvariant(vowelSwapMap[char.ToLowerInvariant(_c)]);
                    }
                }
                _transformedStringBuilder.Append(_transformedChar);
            }
            return _transformedStringBuilder.ToString();
        }

        private static Dictionary<char, char> BuildSwapMap(HashSet<char> fromChars, IEnumerable<char> toChars, int maxSwaps, bool multiLevelSwaps)
        {
            // prepare swap map
            HashSet<char> _randFromSwaps = new HashSet<char>(Randomizer.Randomize(fromChars).Take(maxSwaps));
            if (!multiLevelSwaps)
            {
                toChars = toChars.Except(_randFromSwaps);
            }
            List<char> _randToSwaps = Randomizer.Randomize(toChars).Take(maxSwaps).ToList();
            return _randFromSwaps
                .Zip(_randToSwaps, (_from, _to) => new { _from, _to })
                .ToDictionary(_x => _x._from, _y => _y._to);
        }

        private static string RandomizeString(string original)
        {
            Random _rand = new Random();
            string _result = new string(original.OrderBy(_c => (_rand.Next(2) % 2) == 0).ToArray());
            return _result;
        }

        private static IEnumerable<char> Randomize(IEnumerable<char> original)
        {
            Random _rand = new Random();
            IEnumerable<char> _result = original.OrderBy(_c => (_rand.Next(2) % 2) == 0);
            return _result;
        }
    }
}
