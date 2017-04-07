package roycurtis.jdiscordirc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import roycurtis.jdiscordirc.managers.BridgeManager;
import roycurtis.jdiscordirc.managers.ConfigManager;
import roycurtis.jdiscordirc.managers.DiscordManager;
import roycurtis.jdiscordirc.managers.IRCManager;

/** Main application class; handles init, main loop and exit */
public class JDiscordIRC
{
    public final static BridgeManager  BRIDGE  = new BridgeManager();
    public final static ConfigManager  CONFIG  = new ConfigManager();
    public final static DiscordManager DISCORD = new DiscordManager();
    public final static IRCManager     IRC     = new IRCManager();

    private static final Logger LOG = LoggerFactory.getLogger(JDiscordIRC.class);

    private static boolean exiting = false;

    //TODO: for readme, explain why this doesn't do impersonation

    //<editor-fold desc="Application init, main loop, takedown">
    public static void main(String[] args)
    {
        LOG.info("JDiscordIRC is starting...");
        init();
        loop();
        LOG.warn("JDiscord has died");
    }

    private static void init()
    {
        try
        {
            CONFIG.init();
            DISCORD.init();
            IRC.init();
        }
        catch (Exception ex)
        {
            // Exceptions fired during exit likely due to interrupt (e.g. CTRL+C)
            if ( isExiting() )
                return;

            LOG.error("Exception during setup phase, exiting", ex);
            exit("Could not complete setup");
        }
    }

    private static void loop()
    {
        while ( !isExiting() )
            BRIDGE.pump();
    }
    //</editor-fold>

    //<editor-fold desc="State management">
    public static synchronized boolean isExiting()
    {
        return exiting;
    }

    public static synchronized void exit(String why)
    {
        if ( isExiting() )
            return;

        LOG.warn("Starting exit: {}", why);
        exiting = true;
    }
    //</editor-fold>
}
