using System.ComponentModel;
using Xceed.Wpf.Toolkit.PropertyGrid.Attributes;

namespace TextRandomizerCSharp
{
    public class RandomizerSettings
    {
        [DisplayName("Vowel Swaps")]
        public int VowelSwaps { get; set; }

        [DisplayName("Consonant Swaps")]
        public int ConsonantSwaps { get; set; }

        [DisplayName("Language Set")]
        [ItemsSource(typeof(Languages))]
        public LanguageSet LanguageSet { get; set; }

        [DisplayName("Multi Level Swaps")]
        [Description("An example of multi level swap is: c->x, x->b, b->a")]
        public bool MultiLevelSwaps { get; set; }

        public RandomizerSettings()
        {
        }

        public RandomizerSettings(RandomizerSettings other)
        {
            this.VowelSwaps = other.VowelSwaps;
            this.ConsonantSwaps = other.ConsonantSwaps;
            this.LanguageSet = other.LanguageSet;
            this.MultiLevelSwaps = other.MultiLevelSwaps;
        }
    }
}
