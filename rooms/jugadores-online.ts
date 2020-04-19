import { Room } from "colyseus";

export class JugadoresOnline extends Room {

    jugadoresConectados = [];

    onJoin(client, options) {
        this.broadcast({
            jugadoresConectados: this
                .jugadoresConectados
                .map(jugador => jugador.asJSON())
        });
    }

    onMessage(client, data) {
        const { anunciarNombre } = data
        const jugador = new JugadorOnline(client, anunciarNombre)
        this.jugadoresConectados.push(jugador)
        this.broadcast({
            jugadoresConectados: this
                .jugadoresConectados
                .map(jugador => jugador.asJSON())
        });
    }

    onLeave(client) {
        this.jugadoresConectados = this
            .jugadoresConectados
            .filter(jugador => !jugador.clientEquals(client))
        this.broadcast({
            jugadoresConectados: this
                .jugadoresConectados
                .map(jugador => jugador.asJSON())
        });
    }
}

class JugadorOnline {
    client;
    sessionId;
    nombre;

    constructor(client, nombre) {
        this.client = client
        this.sessionId = client.sessionId
        this.nombre = nombre
    }

    asJSON() {
        return {
            nombre: this.nombre
        }
    }

    clientEquals(client) {
        return this.sessionId === client.sessionId
    }
}