import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import {FurMaterial} from 'babylonjs-materials';
import {Observable} from 'rxjs';
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;

export class Utils {

    /**
     * Creates a basic ground
     */
    static createGround(scene: BABYLON.Scene): BABYLON.Mesh {

        // GroundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
        const ground = BABYLON.Mesh.CreateGroundFromHeightMap(
            "ground",
            "assets/texture/height-map/D2.png",
            2000,
            2000,
            200,
            0,
            100,
            scene,
            false,
            () => {

                const material = new StandardMaterial("fur", scene);
                material.ambientColor = new Color3(1, 1, 1);
                ground.material = material;
                ground.checkCollisions = true;
            });


        ground.position.y = -100;

        return ground;
    }

    static createStatus(scene) {

        this.createMeshFromObjFile('mesh', 'statue.obj', scene).subscribe(mesh => {
            return mesh;
        });
    }

    static createFollowCamera() {

    }

    /**
     * Creates a BABYLONJS GUI with a single Button
     */
    static createGui(btnText: string, btnClicked: (button: GUI.Button) => void) {

        const guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const btnTest = GUI.Button.CreateSimpleButton("but1", btnText);
        btnTest.width = "150px";
        btnTest.height = "40px";
        btnTest.color = "white";
        btnTest.background = "grey";
        btnTest.onPointerUpObservable.add(() => {
            if (btnClicked) {
                btnClicked(btnTest);
            }
        });
        btnTest.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        btnTest.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        btnTest.left = 12;
        btnTest.top = 12;

        guiTexture.addControl(btnTest);
    }

    /**
     * Returns Observable of mesh array, which are loaded from a file.
     * After mesh importing all meshes become given scaling, position and rotation.
     */
    static createMeshFromObjFile(
        folderName: string,
        fileName: string,
        scene: BABYLON.Scene,
        scaling?: BABYLON.Vector3,
        position?: BABYLON.Vector3,
        rotationQuaternion?: BABYLON.Quaternion
    ): Observable<BABYLON.AbstractMesh[]> {

        if (!fileName) {
            return Observable.throw("Utils.createMeshFromObjFile: parameter fileName is empty");
        }
        if (!scene) {
            return Observable.throw("Utils.createMeshFromObjFile: parameter fileName is empty");
        }

        // tslint:disable:no-parameter-reassignment
        if (!folderName) {
            folderName = "";
        }
        if (!scaling) {
            scaling = BABYLON.Vector3.One();
        }
        if (!position) {
            position = BABYLON.Vector3.Zero();
        }
        if (!rotationQuaternion) {
            rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(0, 0, 0);
        }

        const assetsFolder = `./assets/${folderName}/`;

        return new Observable(observer => {
            BABYLON.SceneLoader.ImportMesh(null, assetsFolder, fileName, scene,
                (meshes: BABYLON.AbstractMesh[],
                 particleSystems: BABYLON.ParticleSystem[],
                 skeletons: BABYLON.Skeleton[]) => {
                    meshes.forEach((mesh) => {
                        mesh.position = position;
                        mesh.rotationQuaternion = rotationQuaternion;
                        mesh.scaling = scaling;
                    });
                    console.log(meshes);
                    console.log(`Imported Mesh: ${fileName}`);
                    observer.next(meshes);
                });
        });
    }

    /**
     * Creates a new skybox with the picttures under fileName.
     */
    static createSkybox(name: string, fileName: string, scene: BABYLON.Scene): BABYLON.Mesh {
        if (!name) {
            console.error("Utils.createSkyBox: name is not defined");
            return;
        }
        if (!fileName) {
            console.error("Utils.createSkyBox: fileName is not defined");
            return;
        }
        if (!scene) {
            console.error("Utils.createSkyBox: scene is not defined");
            return;
        }

        // Skybox
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 2000, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/texture/skybox/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(100, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/texture/skybox/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }
}
