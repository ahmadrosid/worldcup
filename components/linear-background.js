
const LinearGradient = ({ option, children, width = 1080, height = 1080 }) => {
    const bgOption = [
        "flex items-center justify-center p-12 bg-gradient-to-r from-cyan-500 to-blue-500 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-sky-500 to-indigo-500 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-purple-500 to-pink-500 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-400 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-pink-500 to-yellow-500 relative",
        "flex items-center justify-center p-12 bg-gradient-to-r from-orange-500 to-amber-500 relative",
    ]

    return (
        <div style={{ width: `${width}`, height: `${height}` }} className={bgOption[option] ? bgOption[option] : `flex items-center justify-center p-12 bg-white relative`}>
            {children}
        </div>
    )
}

export default LinearGradient
