import { ChangeEvent, useState } from "react";

interface IAreaProps<T> {
  name: keyof T;
  value: {
    text: string;
    mimeType: string;
  };
  onChange: (
    name: IAreaProps<T>["name"],
    value: IAreaProps<T>["value"]
  ) => void;
}

const Area = <T extends object>({ name, value, onChange }: IAreaProps<T>) => {
  const [mimeType, setMimeType] = useState("none");

  const handleAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, { text: e.target.value, mimeType });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0].name.match(/\.(.+)$/);
      if (file) {
        setMimeType(file[1]);
      }
    }
  };

  return (
    <div className='area__container'>
      <textarea
        className='area'
        value={value.text}
        onChange={handleAreaChange}
      ></textarea>
      {!value.text && (
        <div className='placeholder area__placeholder'>
          <span>Введіть текст або </span>
          <label tabIndex={0}>
            завантажте файл
            <input
              type='file'
              accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, .rtf, .txt, .pdf, .zip'
              onChange={handleInputChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default Area;
