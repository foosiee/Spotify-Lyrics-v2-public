import logging
import json
from tswift import Song
import azure.functions as func


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    song = None
    artist = None
    try:
        song = req.form.get('song')
        artist = req.form.get('artist')

        logging.info(song)
        logging.info(artist)

        if song != None and artist != None:
            lyrics = getLyrics(song, artist)
            ret = {"lyrics": lyrics, "song": song, "artist": artist}
        else:
            raise Exception
    except:
        ret = {"Error": "Missing required params!", "song": song, "artist":artist}
    return func.HttpResponse(json.dumps(ret))

def getLyrics(song, artist):
    try:
        s = Song(song,artist)
        if not s.lyrics:
            raise Exception
        return s.lyrics
    except Exception as e:
        logging.info(e)
        return "lyrics not found:/"