/** Rail Announcements Generator. By Roy Curtis, MIT license, 2018 */

/** Main class of the entire Rail Announcements Generator application */
class RAG
{
    /** Gets the database manager, which holds station and train data */
    public static database    : Database;
    /** Gets the phrase manager, which generates HTML phrases from XML */
    public static phraser     : Phraser;
    /** Gets the speech synthesizer */
    public static speechSynth : SpeechSynthesis;
    /** Gets the current train and station state */
    public static state       : State;
    /** Gets the view controller, which manages UI interaction */
    public static views       : Views;

    /**
     * Entry point for RAG, to be called from Javascript.
     *
     * @param {RAGConfig} config Configuration object, with rail data to use
     */
    public static main(config: RAGConfig)
    {
        window.onerror        = error => RAG.panic(error);
        window.onbeforeunload = _ => RAG.speechSynth.cancel();

        RAG.database    = new Database(config);
        RAG.views       = new Views();
        RAG.phraser     = new Phraser(config);
        RAG.speechSynth = window.speechSynthesis;

        // Begin

        RAG.views.marquee.set("Welcome to RAG.");
        RAG.generate();
    }

    /** Generates a new random phrase and state */
    public static generate() : void
    {
        RAG.state = new State();
        RAG.views.editor.generate();
    }

    /** Global error handler; throws up a big red panic screen on uncaught error */
    public static panic(error: string | Event = "Unknown error")
    {
        let msg = '<div class="panic">';
        msg    += '<h1>"We are sorry to announce that..."</h1>';
        msg    += `<p>RAG has crashed because: <code>${error}</code>.</p>`;
        msg    += `<p>Please open the console for more information.</p>`;
        msg    += '</div>';

        document.body.innerHTML = msg;
    }
}