export function attachCamera(attachedObject, offsetX, fixedY) {
    onUpdate(() => {
        camPos(attachedObject.pos.x + offsetX, fixedY)
    })
}