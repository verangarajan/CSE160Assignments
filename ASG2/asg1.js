//code inspired by CSE 160 TA tutorial videos


let VERTEX_SHADER = `
    precision mediump float;

    void main()
    {

    }
`;


let FRAGMENT_SHADER = `
    precision mediump float;

    void main()
    {
        
    }
`;


function main()
{
    console.log("Hello World");

    let canvas = document.getElementById("webgl");

    let gl = getWebGLContext(canvas);
    
    if (!gl)
    {
        console.log("Failed to get WebGL context");
        return -1;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(gl);

    let triangle = [-0.5, -0.5, 
                    0.5, -0.5,
                     0.0, 0.5];
}

