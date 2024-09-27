export function attachCamera(attachedObject1, attachedObject2, offsetX, fixedY) {
    onUpdate(() => {
        camPos((attachedObject1.pos.x + attachedObject2.pos.x) / 2 + offsetX, fixedY)
    })
}