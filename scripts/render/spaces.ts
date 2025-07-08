let __current_space__: number;

/**
 *
 */
async function createSpaceProcess() {
    await customPrompt("Введите название простанства", "Главная");

}

/**
 *
 * @param text
 * @param holder
 */
async function customPrompt(text: string, holder: string = "") {
    const {__API__} = window;

    let result = holder;
    const body = document.createElement("div");
    body.id = "custom-prompt";
    const p = document.createElement("p");
    p.id = "custom-prompt-p";
    p.appendChild(document.createTextNode(text));
    const input = document.createElement("input");
    input.id = "custom-prompt-input";
    const accept = document.createElement("button");
    accept.id = "custom-prompt-accept";
    accept.appendChild(document.createTextNode("Подтвердить"));

    const reject = document.createElement("button");
    reject.id = "custom-prompt-reject";
    reject.appendChild(document.createTextNode("Назад"))

    const group = document.createElement("div");
    group.id = "custom-prompt-group";
    group.append(reject, accept)
    body.append(p, input, group);

    const parent = document.body;
    parent.append(body);

    accept.addEventListener("click", async function () {
        result = input.value;
        const name = result;
        if (name.length === 0) {
            return;
        }
        const path = await __API__.getSpacePath();
        if (!path[0]) {
            body.remove();
            return;
        }
        const spaces = await __API__.makeSpace(name, path[1]);
        await paintSpaces(spaces);

        body.remove()

        // @ts-ignore
        const settings: ISettings = await __API__.getSettings();
        settings.current_space = settings.spaces.length - 1;
        __API__.updateSettings(settings);
    })
    reject.addEventListener("click", function () {
        body.remove()
    })


}

/**
 *
 * @param spaces
 */
async function paintSpaces(spaces: ISpace[]) {
    const {__API__} = window;

    const settings = await __API__.getSettings();
    if (settings.current_space === -1) {
        if (settings.spaces.length === 0) {
            return;
        }
        __current_space__ = 0
    } else {
        __current_space__ = settings.current_space;
    }
    const data = document.getElementById("space-name") as HTMLParagraphElement;
    while (data.firstChild) {
        data.removeChild(data.firstChild);
    }
    data.appendChild(document.createTextNode(settings.spaces[__current_space__].name))

    const list = document.getElementById("space-list") as HTMLDivElement;


    while (list.firstChild) {
        list.removeChild(list.firstChild)
    }
    for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        spaceFabric(list, i + 1, space.name, space.path);
    }
}

/**
 *
 * @param parent
 * @param index
 * @param name
 * @param path
 */
function spaceFabric(parent: HTMLDivElement, index: number, name: string, path: string) {
    const body = document.createElement('div');
    body.classList.add("space-element");
    const _number = document.createElement("p");
    _number.classList.add("space-element-number");
    _number.appendChild(document.createTextNode(index.toString()));
    const _name = document.createElement("p");
    _name.classList.add("space-element-name");
    _name.appendChild(document.createTextNode(name));
    const _path = document.createElement("p");
    _path.classList.add("space-element-path");
    _path.appendChild(document.createTextNode(path));


    body.append(_number, _name, _path);
        body.addEventListener("click", async () => {
            await select(body as HTMLDivElement)
        })



    parent.appendChild(body);

}

/**
 *
 * @param body
 */
async function select(body: HTMLDivElement) {
    console.log("start select")
    const p = body.querySelector(".space-element-number") as HTMLParagraphElement;
    console.log(`text: ${p.textContent} :: ${parseInt(p.textContent?? "0")}`);
    __current_space__ = parseInt(p.textContent ?? "1") - 1;
    const {__API__} = window;

    const settings = await __API__.getSettings();
    settings.current_space = __current_space__
    __API__.updateSettings(settings);
    const spaces = await __API__.getAllSpaces();
    await paintSpaces(spaces);
    console.log("end select")
}
