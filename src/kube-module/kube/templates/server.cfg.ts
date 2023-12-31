const baserServerConfig = `// general server info
seta sv_hostname "Q3A TEN FIFTY"      // name that appears in server list
seta g_motd "K8s / OCP RuleZ B1TcH1!"      // message that appears when connecting
seta sv_maxclients 16           // max number of clients than can connect
seta sv_pure 1                  // pure server, no altered pak files
seta g_quadfactor 3             // quad damage strength (3 is normal)
seta g_friendlyFire 1           // friendly fire motherfucker

// free for all
seta g_gametype 0             // 0:FFA, 1:Tourney, 2:FFA, 3:TD, 4:CTF
seta timelimit 20             // Time limit in minutes
seta fraglimit 20             // Frag limit

seta g_weaponrespawn 2          // weapon respawn in seconds
seta g_inactivity 120           // kick players after being inactive for x seconds
seta g_forcerespawn 0           // player has to press primary button to respawn
seta g_log server.log           // log name
seta logfile 3                  // probably some kind of log verbosity?
seta rconpassword "seadog"       // sets RCON password for remote console
seta sv_privateClients 1         // set requirement for client password.
seta sv_privatePassword "" // set password for private server "" for no password

seta rate "12400"               // not sure
seta snaps "40"                 // what this
seta cl_maxpackets "40"         // stuff is
seta cl_packetdup "1"           // all about

// bots
seta bot_enable 1       // Allow bots on the server
seta bot_nochat 1       // Shut those fucking bots up
seta g_spskill 3        // Default skill of bots [1-5]
seta bot_minplayers 6   // This fills the server with bots to satisfy the minimum

// maps
set v1 "map q3dm17; set nextmap vstr v2"
set v2 "map q3dm2; set nextmap vstr v3"
set v3 "map q3dm1; set nextmap vstr v4"
set v4 "map q3dm5; set nextmap vstr v5"
set v5 "map q3dm3; set nextmap vstr v6"
set v6 "map q3dm6; set nextmap vstr v7"
set v7 "map q3dm9 ; set nextmap vstr v8"
set v8 "map q3dm7 ; set nextmap vstr v1"
vstr v1
`;
export { baserServerConfig };
