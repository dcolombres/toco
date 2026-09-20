/**
 * Galería demo de Comunidad TOCO.
 * Se usa en GitHub Pages y si la API no tiene fotos todavía.
 */
const TOCO_COMMUNITY_DEMO = [
    { id: 1, imageUrl: 'public/uploads/comunidad/toco-comunidad-01.jpg', userName: 'Santi', description: 'Pisapapeles de emergencia: la factura de la luz ya no se me vuela cuando prendo el ventilador.', rating: 4.8, voteCount: 34, isOriginal: 0, isAesthetic: 0 },
    { id: 2, imageUrl: 'public/uploads/comunidad/toco-comunidad-02.jpg', userName: 'Martina', description: 'Soporte de celu para la serie de las 23. Quedó a la altura justa y no se me cae.', rating: 4.9, voteCount: 41, isOriginal: 0, isAesthetic: 1 },
    { id: 3, imageUrl: 'public/uploads/comunidad/toco-comunidad-03.jpg', userName: 'Lucas', description: 'Traba de puerta. Chau al portazo cuando hay corriente cruzada en el depto.', rating: 4.4, voteCount: 19, isOriginal: 0, isAesthetic: 0 },
    { id: 4, imageUrl: 'public/uploads/comunidad/toco-comunidad-04.jpg', userName: 'Elena', description: 'Traba de ventana en invierno. El viento ya no me chifla a las 6 AM.', rating: 4.6, voteCount: 22, isOriginal: 0, isAesthetic: 0 },
    { id: 5, imageUrl: 'public/uploads/comunidad/toco-comunidad-05.jpg', userName: 'Sofi', description: 'Apoya mate. Inclino un poquito y la montañita de yerba no se me derrumba.', rating: 5.0, voteCount: 47, isOriginal: 1, isAesthetic: 1 },
    { id: 6, imageUrl: 'public/uploads/comunidad/toco-comunidad-06.jpg', userName: 'Valen', description: 'Lo dejé al lado de la planta y la vela. Quedó como objeto de altar, sin querer.', rating: 4.7, voteCount: 28, isOriginal: 0, isAesthetic: 1 },
    { id: 7, imageUrl: 'public/uploads/comunidad/toco-comunidad-07.jpg', userName: 'Nico', description: 'Dado silencioso para el TEG. A las 2 AM los vecinos ya no nos putean.', rating: 4.8, voteCount: 36, isOriginal: 1, isAesthetic: 0 },
    { id: 8, imageUrl: 'public/uploads/comunidad/toco-comunidad-08.jpg', userName: 'Franco', description: 'Nivelador de mesa en el bar. Chau al cartoncito doblado abajo de la pata.', rating: 4.3, voteCount: 15, isOriginal: 1, isAesthetic: 0 },
    { id: 9, imageUrl: 'public/uploads/comunidad/toco-comunidad-09.jpg', userName: 'Mati', description: 'Posavasos cheto para el fernet. La mesa de pino de mi vieja te lo agradece.', rating: 4.5, voteCount: 24, isOriginal: 0, isAesthetic: 0 },
    { id: 10, imageUrl: 'public/uploads/comunidad/toco-comunidad-10.jpg', userName: 'Juli', description: 'Luna se lo robó a los 3 minutos. Juguete pichicho certificado.', rating: 4.9, voteCount: 52, isOriginal: 1, isAesthetic: 0 },
    { id: 11, imageUrl: 'public/uploads/comunidad/toco-comunidad-11.jpg', userName: 'Diego', description: 'Tótem anti-estrés el día que se cae AFIP. Lo aprieto y sigo.', rating: 4.6, voteCount: 31, isOriginal: 0, isAesthetic: 0 },
    { id: 12, imageUrl: 'public/uploads/comunidad/toco-comunidad-12.jpg', userName: 'Agus', description: 'Martillo zafador para el clavito del cuadro. No fui a buscar la caja de herramientas.', rating: 4.2, voteCount: 11, isOriginal: 1, isAesthetic: 0 },
    { id: 13, imageUrl: 'public/uploads/comunidad/toco-comunidad-13.jpg', userName: 'Fede', description: 'Busca-objetos oficial. Saqué las llaves de abajo del sillón sin tirarme al piso.', rating: 4.4, voteCount: 18, isOriginal: 1, isAesthetic: 0 },
    { id: 14, imageUrl: 'public/uploads/comunidad/toco-comunidad-14.jpg', userName: 'Camila', description: 'Regla a ojímetro para la tarea de mi hijo. La línea salió más o menos recta.', rating: 4.1, voteCount: 9, isOriginal: 1, isAesthetic: 0 },
    { id: 15, imageUrl: 'public/uploads/comunidad/toco-comunidad-15.jpg', userName: 'Paula', description: 'El regalo salvador del amigo invisible. Les dije que era diseño de autor. Coló.', rating: 4.8, voteCount: 29, isOriginal: 0, isAesthetic: 1 },
    { id: 16, imageUrl: 'public/uploads/comunidad/toco-comunidad-16.jpg', userName: 'Renata', description: 'Lo intervine con fibrones. Ahora es un TOCO único. Lo pinta el que lo tiene.', rating: 4.9, voteCount: 38, isOriginal: 1, isAesthetic: 1 },
    { id: 17, imageUrl: 'public/uploads/comunidad/toco-comunidad-17.jpg', userName: 'Inés', description: 'En la mesa de luz, al lado del libro. No sirve para nada y queda hermoso.', rating: 4.7, voteCount: 26, isOriginal: 0, isAesthetic: 1 },
    { id: 18, imageUrl: 'public/uploads/comunidad/toco-comunidad-18.jpg', userName: 'Tomás', description: 'Compañero de home office. Cuando se traba Zoom, lo miro y bajo un cambio.', rating: 4.5, voteCount: 21, isOriginal: 0, isAesthetic: 1 },
    { id: 19, imageUrl: 'public/uploads/comunidad/toco-comunidad-19.jpg', userName: 'Ciro', description: 'Se mudó al balcón con las suculentas. Ahora es parte del jardín mínimo.', rating: 4.6, voteCount: 17, isOriginal: 1, isAesthetic: 1 },
    { id: 20, imageUrl: 'public/uploads/comunidad/toco-comunidad-20.jpg', userName: 'Nacho', description: 'Invitado de lujo al asado del domingo. No lo usé de yesca, prometido.', rating: 4.3, voteCount: 14, isOriginal: 0, isAesthetic: 0 },
    { id: 21, imageUrl: 'public/uploads/comunidad/toco-comunidad-21.jpg', userName: 'Mora', description: 'Tótem de yoga. Lo pongo al frente del mat y me acuerdo de tocar madera.', rating: 4.8, voteCount: 33, isOriginal: 1, isAesthetic: 1 },
    { id: 22, imageUrl: 'public/uploads/comunidad/toco-comunidad-22.jpg', userName: 'Bruno', description: 'Sostiene la receta mientras amaso. El papel ya no se me mete en la harina.', rating: 4.4, voteCount: 13, isOriginal: 0, isAesthetic: 0 },
    { id: 23, imageUrl: 'public/uploads/comunidad/toco-comunidad-23.jpg', userName: 'Lola', description: 'Soporte de incienso improvisado. El palito entra en las letras y queda zen.', rating: 4.9, voteCount: 40, isOriginal: 1, isAesthetic: 1 },
    { id: 24, imageUrl: 'public/uploads/comunidad/toco-comunidad-24.jpg', userName: 'Bianca', description: 'En la biblioteca, entre libros y flores secas. Parece una escultura chiquita.', rating: 4.7, voteCount: 25, isOriginal: 0, isAesthetic: 1 },
    { id: 25, imageUrl: 'public/uploads/comunidad/toco-comunidad-25.jpg', userName: 'Lautaro', description: 'En el escritorio de estudio. Cuando no me da más la cabeza, lo giro un rato.', rating: 4.5, voteCount: 16, isOriginal: 0, isAesthetic: 0 }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOCO_COMMUNITY_DEMO;
}
