class Camera
{
    constructor()
    {
        this.eye = new Vector3([0, 0,3]);
        this.at = new Vector3([0, 0, -100]);
        this.up = new Vector3([0, 1, 0]);
    }

    forward()
    {
        var f = this.at.sub(this.eye);
       // console.log("This is f", f);
        f=f.div(f.magnitude());
        this.at = this.at.add(f);
       // console.log("This is at", this.at)
        this.eye = this.eye.add(f);
        //console.log("This is eye", this.eye)
    }

    back()
    {
        var f = this.eye.sub(this.at);
        f = f.div(f.magnitude());
        this.at = this.at.add(f);
        this.eye = this.eye.add(f);
    }

    left()
    {
        var f = this.eye.sub(this.at);
        f = f.div(f.magnitude());
        var s = Vector3.cross(f, this.up);
        s=s.div(s.magnitude());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    right() {
        var f = this.eye.sub(this.at);
        f = f.div(f.magnitude()); 
        var s = Vector3.cross(f, this.up);       
        s = s.div(s.magnitude());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    panLeft() {
        const angle = 2; // degrees
        const dir = new Vector3(this.at.elements); // clone `at`
        dir.sub(this.eye); // direction vector from eye to at
    
        const rotation = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const newDir = rotation.multiplyVector3(dir); // rotate the direction
    
        this.at = new Vector3(this.eye.elements); // reset at to eye
        this.at.add(newDir); // add rotated direction to eye
    }
    
    panRight() {
        const angle = -2; // negative for right
        const dir = new Vector3(this.at.elements); // clone `at`
        dir.sub(this.eye); // direction vector from eye to at
    
        const rotation = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const newDir = rotation.multiplyVector3(dir); // rotate the direction
    
        this.at = new Vector3(this.eye.elements); // reset at to eye
        this.at.add(newDir); // add rotated direction to eye
    }

    panLeftDrag() {
        const angle = 20; // degrees
        const dir = new Vector3(this.at.elements); // clone `at`
        dir.sub(this.eye); // direction vector from eye to at
    
        const rotation = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const newDir = rotation.multiplyVector3(dir); // rotate the direction
    
        this.at = new Vector3(this.eye.elements); // reset at to eye
        this.at.add(newDir); // add rotated direction to eye
    }
    
    panRightDrag() {
        const angle = -20; // negative for right
        const dir = new Vector3(this.at.elements); // clone `at`
        dir.sub(this.eye); // direction vector from eye to at
    
        const rotation = new Matrix4().setRotate(angle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        const newDir = rotation.multiplyVector3(dir); // rotate the direction
    
        this.at = new Vector3(this.eye.elements); // reset at to eye
        this.at.add(newDir); // add rotated direction to eye
    }
}