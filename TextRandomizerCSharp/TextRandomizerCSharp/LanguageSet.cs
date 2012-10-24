
namespace TextRandomizerCSharp
{
    public class LanguageSet
    {
        public string Consonants { get; private set; }
        public string Vowels { get; private set; }

        public LanguageSet(string consonants, string vowels)
        {
            this.Consonants = consonants;
            this.Vowels = vowels;
        }
    }
}
