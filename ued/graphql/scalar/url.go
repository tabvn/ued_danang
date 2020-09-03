package scalar

import (
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"io"
	"strings"
)

const encodeHex = "0123456789ABCDEF"

func MarshalURL(s string) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		writeQuotedString(w, s)
	})
}

func writeQuotedString(w io.Writer, s string) {
	start := 0
	io.WriteString(w, `"`)

	for i, c := range s {
		if c < 0x20 || c == '\\' || c == '"' {
			io.WriteString(w, s[start:i])

			switch c {
			case '\t':
				io.WriteString(w, `\t`)
			case '\r':
				io.WriteString(w, `\r`)
			case '\n':
				io.WriteString(w, `\n`)
			case '\\':
				io.WriteString(w, `\\`)
			case '"':
				io.WriteString(w, `\"`)
			default:
				io.WriteString(w, `\u00`)
				w.Write([]byte{encodeHex[c>>4], encodeHex[c&0xf]})
			}

			start = i + 1
		}
	}

	io.WriteString(w, s[start:])
	io.WriteString(w, `"`)
}

func UnmarshalURL(v interface{}) (string, error) {
	switch v := v.(type) {
	case string:
		if !strings.HasPrefix(v, "http://") && !strings.HasPrefix(v, "https://") {
			return "", fmt.Errorf("%s is not url", v)
		}
		return v, nil
	case nil:
		return "null", nil
	default:
		return "", fmt.Errorf("%T is not a string", v)
	}
}
