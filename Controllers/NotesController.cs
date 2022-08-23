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
                
            }
            else {
                returnedData = returnedData.FindAll(n => n.ToDelete != false);
            }
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
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return Ok(await _context.Notes.ToListAsync());

        }

        [HttpPut(Name = "editOne")]

        public async Task<ActionResult<List<Note>>> UpdateNote(Note request)
        {
            var noteDB = await _context.Notes.FindAsync(request.Id);
            if (noteDB == null) { return BadRequest("Target resource not found"); }

            //update parameters of note
            noteDB.Title = request.Title;
            noteDB.Content = request.Content;
            noteDB.Date = DateTime.Now;

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
