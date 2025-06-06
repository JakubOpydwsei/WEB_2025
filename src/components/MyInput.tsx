import { Form } from "react-bootstrap";


type Props = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
}

function MyInput({ label, value, onChange, type = 'text', placeholder }: Props) {
    return (
        <Form.Group className="mb-3">
            <Form.Label className="text-center">{label}</Form.Label>
            {type === 'textarea' ? (
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="text-center"
                />
            ) : (
                <Form.Control
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="text-center"
                />
            )}
        </Form.Group>
    );
}


export default MyInput;