namespace NotesProject
{
    public class Note
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public DateTime Date { get; set; }

        public DateTime? EditDate { get; set; }

        public bool ToDelete { get; set; }

        public string? Tags { get; set; }
    }
}
