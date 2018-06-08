/** Rail Announcements Generator. By Roy Curtis, MIT license, 2018 */

/** Disposable class that holds state for the current schedule, train, etc. */
class State
{
    private _platform?    : Platform;
    private _named?       : string;
    private _service?     : string;
    private _stationCode? : string;
    private _time?        : string;

    get platform() : Platform
    {
        if (this._platform)
            return this._platform;

        let platform: Platform = ['', ''];

        // Only 2% chance for platform 0, since it's rare
        platform[0] = Random.bool(98)
            ? Random.int(1, 26).toString()
            : '0';

        // Only 10% chance for platform letter, since it's uncommon
        platform[1] = Random.bool(10)
            ? Random.array('ABC')
            : '';

        this._platform = platform;
        return this._platform;
    }

    set platform(value: Platform)
    {
        this._platform = value;
    }

    get named(): string
    {
        if (this._named)
            return this._named;

        this._named = RAG.database.pickNamed();
        return this._named;
    }

    set named(value: string)
    {
        this._named = value;
    }

    get service(): string
    {
        if (this._service)
            return this._service;

        this._service = RAG.database.pickService();
        return this._service;
    }

    set service(value: string)
    {
        this._service = value;
    }

    get stationCode(): string
    {
        if (this._stationCode)
            return this._stationCode;

        this._stationCode = RAG.database.pickStationCode();
        return this._stationCode;
    }

    set stationCode(value: string)
    {
        this._stationCode = value;
    }

    get time(): string
    {
        if (!this._time)
        {
            let hour   = Random.int(0, 23).toString().padStart(2, '0');
            let minute = Random.int(0, 59).toString().padStart(2, '0');

            this._time = `${hour}:${minute}`;
        }

        return this._time;
    }

    set time(value: string)
    {
        this._time = value;
    }
}