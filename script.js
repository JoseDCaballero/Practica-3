//el DOMContentLoaded se Activa cuanod la pgina se carga completamente
document.addEventListener('DOMContentLoaded', function(){
    cargarLocalidad();
    cargarPersonas();
});

document.getElementById("formulario").addEventListener('submit', function(event){
    event.preventDefault();
    crearPersona();
})


async function cargarLocalidad(){
    const selectLocalidad = document.getElementById("localidad");

    const response = await fetch('municipios-localidades.json');
    const data = await response.json();

    console.log(data.Yucatán);
    //usar un for es adecuado para un recorer un objeto
    for (const municipio in data.Yucatán){
        const option = document.createElement('option');
        option.value = municipio;
        option.text = municipio;
        selectLocalidad.appendChild(option);
    }
}

async function cargarMunicipio(){
    const selectMunicipio = document.getElementById("municipio");
    const selectLocalidad = document.getElementById("localidad");
    const Localidad = selectLocalidad.value;

    const response = await fetch('municipios-localidades.json');
    const data = await response.json();

    const municipios = data.Yucatán[Localidad];

    console.log(municipios);

    selectMunicipio.innerHTML = '<option value="" selected>Selecciona una municipio</option>';

    //pro si es un arry ahi si es corecto usar un forEach
    municipios.forEach(municipio => {
        const option = document.createElement('option');
        option.value = municipio;
        option.text = municipio;
        selectMunicipio.appendChild(option);
    });
}

async function crearPersona(){
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellido").value;
    const direccion = document.getElementById("direccion").value;
    const localidad = document.getElementById("localidad").value;
    const municipio = document.getElementById("municipio").value;

    const persona = { nombre, apellidos, direccion, localidad, municipio };

    try {
        document.querySelector("button[type='submit']").disabled = true;
        const response = await fetch('https://actividad3-api-production.up.railway.app/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(persona)
        });

        cargarPersonas();
        document.getElementById("formulario").reset();//el formulario tiene es metodo por defecto, no sabia
    } catch (error) {
        alert("Ocurrio un error al crear la persona");
    }
    finally{
        document.querySelector("button[type='submit']").disabled = false;
    }

}

async function cargarPersonas(){
    tablaCuerpo = document.getElementById("tablaContenido");
    tablaCuerpo.innerHTML = "";
    document.getElementById("errorTabla").textContent = "";
    try {
        const response = await fetch('https://actividad3-api-production.up.railway.app/api/auth/get-all');
        const data = await response.json();

        data.forEach(persona => {
            const row = document.createElement('tr');

            const nombreCelda = document.createElement('td');
            nombreCelda.textContent = persona.nombre;
            row.appendChild(nombreCelda);

            const apellidoCelda = document.createElement('td');
            apellidoCelda.textContent = persona.apellidos;
            row.appendChild(apellidoCelda);

            const direccionCelda = document.createElement('td');
            direccionCelda.textContent = persona.direccion;
            row.appendChild(direccionCelda);

            const localidadCelda = document.createElement('td');
            localidadCelda.textContent = persona.localidad;
            row.appendChild(localidadCelda);

            const municipioCelda = document.createElement('td');
            municipioCelda.textContent = persona.municipio;
            row.appendChild(municipioCelda);

            tablaCuerpo.appendChild(row);
        });

        console.log(data);
    } catch (error) {
        document.getElementById("errorTabla").textContent = "Ocurrio un error al cargar las personas";
    }
}