using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NotesProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly DataContext _context;
        public NotesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{mode}", Name = "getAll")]
        public async Task<ActionResult<List<Note>>> Get(string mode)
        {

            var returnedData = await _context.Notes.ToListAsync();

            if (mode == "default"){
                returnedData = returnedData.FindAll(n => n.ToDelete == false);
                returnedData.Sort((a, b) => a.Date.CompareTo(b.Date));
                returnedData.Reverse(); //new to old
                
            }
            else {
                returnedData = returnedData.FindAll(n => n.ToDelete != false);
            }
            return Ok(returnedData);  
        }

        [HttpGet("search/{mode}/{text}", Name = "getSearched")]

        public async Task<ActionResult<List<Note>>> GetSearched (string mode, string text)
        {
            var returnedData = await _context.Notes.ToListAsync();
            returnedData = returnedData.FindAll(n => n.Title.Contains(text) || n.Content.Contains(text));
            bool modeDisplay = false;
            if(mode == "deleted")
            {
                modeDisplay = true;
            }
            returnedData = returnedData.FindAll(n => n.ToDelete == modeDisplay);
            return Ok(returnedData);
        }

        //[HttpGet("{id}", Name = "getOne")]
        //public async Task<ActionResult<Note>> Get(int id)
        //{
        //    //var note = notes[id];
        //    var note = await _context.Notes.FindAsync(id);
        //    if (note == null) { return BadRequest("Not found."); }
        //    return Ok(note);
        //}

        [HttpPost(Name = "addOne")]

        public async Task<ActionResult<List<Note>>> AddNote(Note note)
        {

            note.Date = DateTime.Now;
            if(note.Title == null && note.Content == null)
            {
                return BadRequest("double null value");
            }
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return Ok(await _context.Notes.ToListAsync());

        }

        [HttpPut(Name = "editOne")]

        public async Task<ActionResult<List<Note>>> UpdateNote(Note request)
        {
            var noteDB = await _context.Notes.FindAsync(request.Id);
            if (noteDB == null) { return BadRequest("Target resource not found"); }
            if (request.Title == null && request.Content == null)
            {
                return BadRequest("double null values");
            }
            //update parameters of note
            noteDB.Title = request.Title;
            noteDB.Content = request.Content;
            noteDB.Date = DateTime.Now;
            noteDB.EditDate = request.Date;

            await _context.SaveChangesAsync();


            return Ok(await _context.Notes.ToListAsync());
        }

        [HttpDelete("{id}", Name = "deleteOne")]
        public async Task<ActionResult> DeleteNote(int id)
        {
            var noteDB = await _context.Notes.FindAsync(id);
            if(noteDB == null) { return BadRequest("Target resource not found"); }

            _context.Notes.Remove(noteDB);
            await _context.SaveChangesAsync();

            return Ok(await _context.Notes.ToListAsync());
        }

        [HttpPut("delete", Name = "complexDeletion")]

        public async Task<ActionResult<List<Note>>> UpdateNoteDelete(Note request)
        {
            var noteDB = await _context.Notes.FindAsync(request.Id);
            if (noteDB == null) { return BadRequest("Target resource not found"); }

            //update parameters of note
            //if (noteDB.ToDelete == null) {
            //    noteDB.ToDelete = false;
            //}
            noteDB.ToDelete = !noteDB.ToDelete;

            await _context.SaveChangesAsync();


            return Ok(await _context.Notes.ToListAsync());
        }

    }
}
