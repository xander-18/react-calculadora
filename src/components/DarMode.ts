export const DarkMode = () => {
   const body = document .body;
   const button: HTMLButtonElement = document.createElement('button');
  button.innerText = '🌓 Modo Oscuro';

     //su estilo del btn
     button.style.position = 'fixed';
     button.style.top = '20px';
     button.style.right = '20px';
     button.style.padding = '10px 20px';
     button.style.borderRadius = '5px';
     button.style.cursor = 'pointer';
     button.style.backgroundColor = '#f0f0f0';
       

       //funcion de modo oscuro y claro
       button.onclick = () => {
        body.classList.toggle('dark-mode'); // Alternar clase
        if (body.classList.contains('dark-mode')) {
          button.innerText = '🌙 Modo Claro'; // Cambiar texto del botón
        } else {
          button.innerText = '🌓 Modo Oscuro'; // Cambiar texto del botón
        }
      };





 //issertar boton en el DOM
 document.body.appendChild(button);
 };
